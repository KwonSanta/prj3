package com.backend.board.mapper;

import com.backend.board.domain.Board;
import com.backend.board.domain.Category;
import com.backend.file.domain.File;
import com.backend.fileList.domain.FileList;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    // 게시물 작성
    @Insert("""
            INSERT INTO BOARD (TITLE, CONTENT, MEMBER_ID, CATEGORY_ID, VIEWS)
            VALUES (#{title}, #{content}, #{memberId} , #{categoryId}, 1)
            """)
    /* 파일 첨부를 위해 insert 되면 pk를 boardId에 세팅 */
    @Options(useGeneratedKeys = true, keyProperty = "boardId")
    int insert(Board board);

    // 게시물 파일 첨부(게시물의 categoryId를 참고해서 division 삽입, parentId? boardId?)
    @Insert("""
            <script>
            INSERT INTO FILE(PARENT_ID, DIVISION, FILE_NAME)
            VALUES (#{parentId},
                    <choose>
                        <when test="categoryId == 1"> 'NOTICE' </when>
                        <when test="categoryId == 2"> 'FAQ' </when>
                    </choose>,
                    #{fileName})
            </script>
            """)
    int insertFileList(Integer parentId, String fileName, Integer categoryId);

    // 게시물 목록 조회
    @Select("""
            <script>
            SELECT B.BOARD_ID, B.VIEWS, B.TITLE, B.INPUT_DT, B.UPDATE_DT,
                   C.CATEGORY_NAME, C.CATEGORY_ID,
                   CASE WHEN C.CATEGORY_ID = 1 THEN 'NOTICE'
                        WHEN C.CATEGORY_ID = 2 THEN 'FAQ'
                        ELSE 'UNKNOWN'
                   END AS DIVISION,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS WRITER,
                   COUNT(DISTINCT CASE
                       WHEN SUBQUERY_TABLE.DIVISION IN ('NOTICE', 'FAQ') THEN SUBQUERY_TABLE.FILE_NAME
                       ELSE NULL
                   END) AS number_of_images,
                   COUNT(DISTINCT CASE
                       WHEN D.DIVISION IN ('NOTICE', 'FAQ') THEN D.COMMENT_ID
                       ELSE NULL
                   END) AS number_of_comments,
                   COUNT(DISTINCT L.MEMBER_ID) number_of_likes
            FROM BOARD B LEFT JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
                         LEFT JOIN CATEGORY C ON B.CATEGORY_ID = C.CATEGORY_ID
                         LEFT JOIN (SELECT PARENT_ID, FILE_NAME, DIVISION FROM FILE) AS SUBQUERY_TABLE
                                ON B.BOARD_ID = SUBQUERY_TABLE.PARENT_ID
                         LEFT JOIN (SELECT COMMENT_ID, PARENT_ID, DIVISION FROM COMMENT) AS D
                                ON B.BOARD_ID = D.PARENT_ID
                         LEFT JOIN LIKES L ON B.BOARD_ID = L.BOARD_ID
                <trim prefix="WHERE" prefixOverrides="AND">
                    <trim prefix="(" suffix=")" prefixOverrides="OR">
                        <if test="searchType != null">
                            <bind name="pattern" value="'%' + searchKeyword + '%'" />
                            <if test="searchType == 'titleContent'">
                                OR TITLE LIKE #{pattern}
                                OR CONTENT LIKE #{pattern}
                            </if>
                            <if test="searchType == 'title'">
                                OR TITLE LIKE #{pattern}
                            </if>
                            <if test="searchType == 'content'">
                                OR CONTENT LIKE #{pattern}
                            </if>
                            <if test="searchType == 'nickname'">
                                OR M.NICKNAME LIKE #{pattern}
                            </if>
                        </if>
                    </trim>
                    <trim>
                    <if test="categoryType != null">
                        <if test="categoryType =='notice' ">
                            AND C.CATEGORY_NAME LIKE 'NOTICE'
                        </if>
                        <if test="categoryType == 'faq'">
                            AND C.CATEGORY_NAME LIKE 'FAQ'
                        </if>
                    </if>
                    </trim>
                </trim>
            GROUP BY B.BOARD_ID
            ORDER BY BOARD_ID DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectAllPaging(Integer offset, String searchType, String searchKeyword, String categoryType);

    // 게시물 목록 카테고리 조회
    @Select("""
            SELECT *
            FROM CATEGORY
            """)
    List<Category> selectAllPagingForCategory(Integer offset, String searchType, String searchKeyword, String categoryType);

    // 하나의 게시물 조회(M.MEBER_ID -> B.MEMBER_ID, WHERE에 B.BOARD_ID)
    @Select("""
            SELECT B.BOARD_ID, B.TITLE, B.CONTENT, B.INPUT_DT, B.UPDATE_DT, B.CATEGORY_ID,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS WRITER,
                   B.MEMBER_ID, C.CATEGORY_NAME DIVISION
            FROM BOARD B JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
                         JOIN CATEGORY C ON B.CATEGORY_ID = C.CATEGORY_ID
            WHERE B.BOARD_ID = #{boardId}
              AND C.CATEGORY_NAME IN ('NOTICE', 'FAQ')
            """)
    Board selectByBoardId(Integer boardId);

    // 하나의 게시물에서 파일 이름 조회(2개 테스트)
    @Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_ID, B.BOARD_ID, F.DIVISION
            FROM FILE F
            JOIN BOARD B ON F.PARENT_ID = B.BOARD_ID
            WHERE PARENT_ID = #{parentId}
            """)
    List<String> selectByFileNameByBoardId(Integer parentId);

    /*@Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_ID, F.DIVISION, B.BOARD_ID, B.CATEGORY_ID
            FROM FILE F
            JOIN (SELECT BOARD_ID, CATEGORY_ID FROM BOARD) AS B ON F.PARENT_ID = B.BOARD_ID
            WHERE PARENT_ID = #{parentId}
            """)
    List<String> selectByFileNameByBoardId(Integer parentId);*/

    // 게시물 파일 이름 조회2
    @Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_ID, F.DIVISION, B.BOARD_ID
            FROM FILE F
            JOIN BOARD B ON F.PARENT_ID = B.BOARD_ID
            WHERE B.BOARD_ID = #{boardId}
                        """)
    List<FileList> selectByFileNameByBoardIdForUpdate(Integer boardId);


    // 게시물 수정
    @Update("""
            UPDATE BOARD
            SET TITLE = #{title},
                CONTENT = #{content},
                UPDATE_DT = CURRENT_TIMESTAMP
            WHERE BOARD_ID = #{boardId}
              AND CATEGORY_ID IN (1, 2)
            """)
    int update(Board board);

    // 게시물 수정시 첨부된 파일 삭제(#{}에 parentId, boardId)
    @Delete("""
            DELETE FROM FILE
            WHERE PARENT_ID = #{parentId}
              AND FILE_NAME = #{fileName}
            """)
    int deleteByBoardIdAndName(Integer parentId, String fileName);

    // 게시물 삭제
    @Delete("""
            DELETE FROM BOARD
            WHERE BOARD_ID = #{boardId}
            """)
    int deleteByBoardId(Integer boardId);

    @Delete("""
            DELETE FROM FILE
            WHERE PARENT_ID = #{parentId}
              AND FILE_NAME = #{fullPath}
            """)
    int deleteFileByBoardIdAndFileName(Integer parentId, String fullPath);

    // 게시물 클릭시 조회수 업데이트
    @Update("""
            UPDATE BOARD
            SET VIEWS = VIEWS + 1
            WHERE BOARD_ID = #{boardId}
            """)
    int updateViews(Integer boardId);

    // 게시물 목록에서 총 게시물 개수 조회
    @Select("""
            <script>
            SELECT COUNT(BOARD_ID), M.NICKNAME, C.CATEGORY_ID, C.CATEGORY_NAME
            FROM BOARD B LEFT JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
                         LEFT JOIN CATEGORY C ON B.CATEGORY_ID = C.CATEGORY_ID
                <trim prefix="WHERE" prefixOverrides="AND">
                    <trim prefix="(" suffix=")" prefixOverrides="OR">
                        <if test="searchType != null">
                            <bind name="pattern" value="'%' + searchKeyword + '%'" />
                            <if test="searchType == 'titleContent'">
                                OR TITLE LIKE #{pattern}
                                OR CONTENT LIKE #{pattern}
                            </if>
                            <if test="searchType == 'title'">
                                OR TITLE LIKE #{pattern}
                            </if>
                            <if test="searchType == 'content'">
                                OR CONTENT LIKE #{pattern}
                            </if>
                            <if test="searchType == 'nickname'">
                                OR M.NICKNAME LIKE #{pattern}
                            </if>
                        </if>
                    </trim>
                    <trim>
                    <if test="categoryType != null">
                        <if test="categoryType =='notice' ">
                            AND C.CATEGORY_NAME LIKE 'NOTICE'
                        </if>
                        <if test="categoryType == 'faq'">
                            AND C.CATEGORY_NAME LIKE 'FAQ'
                        </if>
                    </if>
                    </trim>
                </trim>
            </script>
            """)
    Integer countAllWithSearch(String searchType, String searchKeyword, String categoryType);


    @Select("""
            SELECT B.BOARD_ID
            FROM BOARD B JOIN COMMENT C ON B.BOARD_ID = C.PARENT_ID
            WHERE B.BOARD_ID = #{boardId}
            """)
    Integer selectByBoardIdForComment(Integer boardId);

    // 좋아요 삭제
    @Delete("""
            DELETE FROM LIKES
            WHERE BOARD_ID = #{boardId}
              AND MEMBER_ID = #{memberId}
            """)
    int deleteLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);

    // 좋아요
    @Insert("""
            INSERT INTO LIKES (BOARD_ID, MEMBER_ID)
            VALUES (#{boardId}, #{memberId})
            """)
    int insertLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);

    // 좋아요 카운트
    @Select("""
            SELECT COUNT(*)
            FROM LIKES
            WHERE BOARD_ID = #{boardId}
            """)
    int selectCountLikeByBoardId(Integer boardId);

    // 좋아요 했으면 count가 1, 아니면 0
    @Select("""
            SELECT COUNT(*)
            FROM LIKES
            WHERE BOARD_ID = #{boardId}
              AND MEMBER_ID = #{memberId}
            """)
    int selectLikeByBoardIdAndMemberId(Integer boardId, String memberId);

    // 게시물 삭제시 좋아요 먼저 삭제
    @Delete("""
            DELETE FROM LIKES
            WHERE BOARD_ID = #{boardId}
            """)
    int deleteLikeByBoardId(Integer boardId);

    // 회원탈퇴시 좋아요 먼저 삭제
    @Delete("""
            DELETE FROM LIKES
            WHERE MEMBER_ID = #{memberId}
            """)
    int deleteLikeByMemberId(Integer memberId);

    @Select("""
            SELECT *
            FROM FILE
            WHERE FILE_NAME = #{fullPath}
            """)
    File findFileByFullPath(String fullPath);

    @Update("""
            UPDATE FILE
            SET FILE_NAME = #{fileName}
            WHERE FILE_ID = #{fileId}
            """)
    int updateFile(File existingFile);

    @Insert("""
            <script>
            INSERT INTO FILE(PARENT_ID, DIVISION, FILE_NAME)
            VALUES (#{parentId},
                    <choose>
                        <when test="categoryId == 1"> 'NOTICE' </when>
                        <when test="categoryId == 2"> 'FAQ' </when>
                    </choose>,
                    #{fileName})
            </script>
            """)
    int insertFile(File fileRecord);

    /*    SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_ID, B.BOARD_ID
        FROM FILE F
        JOIN BOARD B ON F.PARENT_ID = B.BOARD_ID
        WHERE PARENT_ID = #{parentId}*/
    @Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_ID, B.BOARD_ID
            FROM FILE F JOIN BOARD B ON F.PARENT_ID = B.BOARD_ID
            WHERE F.PARENT_ID = #{parentId}
              AND F.DIVISION = #{division}
            """)
    List<File> selectFileByDivisionAndParentId(String division, Integer parentId);

    @Delete("""
            DELETE FROM FILE
            WHERE PARENT_ID = #{parentId}
              AND DIVISION IN ('NOTICE', 'FAQ')
            """)
    int deleteFileByBoardId(Integer parentId);

    @Insert("""
            <script>
            INSERT INTO FILE(PARENT_ID, DIVISION, FILE_NAME)
            VALUES (#{parentId},
                    <choose>
                        <when test="categoryId == 1"> 'NOTICE' </when>
                        <when test="categoryId == 2"> 'FAQ' </when>
                    </choose>,
                    #{fullPath})
            </script>
            """)
    int insertFileListByFullPath(Integer parentId, String fullPath, Integer categoryId);

    String getDivision();

    @Delete("""
            DELETE FROM FILE
            WHERE PARENT_ID = #{boardId}
              AND DIVISION = #{division}
            """)
    int deleteFileByBoardIdAndCategory(Integer boardId, String division);

    @Select("""
            SELECT F.FILE_ID, F.PARENT_ID, F.DIVISION, F.FILE_NAME, F.INPUT_DT, F.UPDATE_DT
            FROM FILE F 
            JOIN BOARD B ON F.PARENT_ID = B.BOARD_ID
            WHERE F.PARENT_ID = #{boardId}
              AND F.DIVISION = #{division}
            """)
    List<File> selectFileByBoardIdAndCategory(Integer boardId, String division);

    @Select("""
            SELECT F.FILE_ID, F.PARENT_ID, F.DIVISION, F.FILE_NAME, F.INPUT_DT, F.UPDATE_DT
            FROM FILE F 
            WHERE F.PARENT_ID = #{boardId}
              AND F.DIVISION IN 
            <foreach item="item" index="index" collection="divisions"
                     open="(" separator="," close=")">
                #{item}
            </foreach>
            """)
    List<File> selectFileByBoardIdAndCategories(Integer boardId, List<String> targetDivisions);

    @Delete("""
            DELETE FROM FILE
            WHERE PARENT_ID = #{boardId}
              AND DIVISION IN 
            <foreach item="item" index="index" collection="divisions"
                     open="(" separator="," close=")">
                #{item}
            </foreach>
            """)
    int deleteFileByBoardIdAndCategories(Integer boardId, List<String> targetDivisions);

    List<File> selectFileByBoardIdAndDivision(Integer boardId, String division);

    int deleteFileByFileId(int fileId);
}
