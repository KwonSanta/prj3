import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../LoginProvider.jsx";
import { ReviewCommentEdit } from "./ReviewCommentEdit.jsx";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";

export function ReviewCommentItem({
  comment,
  isProcessing,
  setIsProcessing,
  spaceId,
  addReply,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [replies, setReplies] = useState([]);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  const starArray = [1, 2, 3, 4, 5];
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [member, setMember] = useState({});

  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClickDeleteReviewComment() {
    setIsProcessing(true);
    axios
      .delete("/api/comment/deleteReview", {
        data: { commentId: comment.commentId },
      })
      .then((res) => {
        toast({
          status: "info",
          description: "REVIEW가 삭제되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => {})
      .finally(() => {
        onClose();
        setIsProcessing(false);
      });
  }

  useEffect(() => {
    if (account.id) {
      axios
        .get(`/api/member/${account.id}`)
        .then((res) => {
          setMember(res.data);
        })
        .catch(() => {});
    }
  }, [account]);

  useEffect(() => {
    axios
      .get(`/api/commentRe/listAll/${comment.commentId}`)
      .then((response) => {
        setReplies(response.data);
      })
      .catch((error) => console.error("Error fetching replies:", error));
  }, [comment.commentId]);

  function handleNewReplySubmit() {
    if (!newReplyContent.trim()) {
      toast({
        status: "warning",
        description: "대댓글 내용을 입력해주세요.",
        position: "top",
        duration: 700,
      });
      return;
    }

    setIsProcessing(true);
    axios
      .post("/api/commentRe/write", {
        commentId: comment.commentId,
        content: newReplyContent,
        memberId: account.id,
        nickname: account.nickname,
        targetId: comment.memberId,
      })
      .then((res) => {
        const newReply = {
          ...res.data,
          content: newReplyContent,
          nickname: account.nickname,
          targetName: comment.nickname,
        };
        setReplies([...replies, newReply]);
        addReply(comment.commentId, newReply); // CommentList의 상태 업데이트

        setNewReplyContent("");
        toast({
          status: "success",
          description: "대댓글이 작성되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsProcessing(false));
  }

  function handleReplyEdit(replyId, content) {
    setEditingReplyId(replyId);
    setEditingReplyContent(content);
  }

  function handleReplyUpdate() {
    setIsProcessing(true);
    axios
      .put("/api/commentRe/update", {
        commentReId: editingReplyId,
        content: editingReplyContent,
      })
      .then(() => {
        const updatedReplies = replies.map((reply) =>
          reply.commentReId === editingReplyId
            ? { ...reply, content: editingReplyContent }
            : reply,
        );
        setReplies(updatedReplies);
        setEditingReplyId(null);
        toast({
          status: "success",
          description: "대댓글이 수정되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsProcessing(false));
  }

  function handleReplyDelete(replyId) {
    setIsProcessing(true);
    axios
      .delete(`/api/commentRe/delete/${replyId}`)
      .then(() => {
        const updatedReplies = replies.filter(
          (reply) => reply.commentReId !== replyId,
        );
        setReplies(updatedReplies);
        toast({
          status: "success",
          description: "대댓글이 삭제되었습니다.",
          position: "top",
          duration: 700,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsProcessing(false));
  }

  const s3BaseUrl = "https://studysanta.s3.ap-northeast-2.amazonaws.com/prj3";

  return (
    <Card>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Flex justify="space-between" align="center">
            <HStack>
              <Avatar src={comment.profileImage} size="md" />
              <Text fontSize="xl">{comment.nickname}</Text>
            </HStack>
            <Text>좋아요</Text>
          </Flex>

          {isEditing || (
            <Box>
              <Flex align="center" mb={2}>
                <Wrap>
                  {starArray.map((star) => (
                    <WrapItem key={star}>
                      {comment.rateScore >= 1 && (
                        <Image
                          w={6}
                          src={`${s3BaseUrl}/ic-star-${star <= comment.rateScore ? "on" : "off"}.png`}
                          alt="star"
                        />
                      )}
                    </WrapItem>
                  ))}
                </Wrap>
                <Text ml={2}>{comment.rateScore}점</Text>
                <Spacer />
                {account.hasAccess(comment.memberId) && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FaEllipsisV />}
                      variant="ghost"
                    />
                    <MenuList minWidth={"60px"}>
                      <MenuItem onClick={() => setIsEditing(!isEditing)}>
                        수정
                      </MenuItem>
                      <MenuItem onClick={onOpen}>삭제</MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Flex>
              <SimpleGrid columns={[2, 3, 4]} spacing={2} mb={2}>
                {comment.commentFilesLists &&
                  comment.commentFilesLists.map((file) => (
                    <Image
                      key={file.fileName}
                      src={file.src}
                      alt={file.fileName}
                    />
                  ))}
              </SimpleGrid>
              <Text>{comment.content}</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                {comment.inputDt}
              </Text>
            </Box>
          )}

          {isEditing && (
            <ReviewCommentEdit
              comment={comment}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              setIsEditing={setIsEditing}
              spaceId={spaceId}
            />
          )}

          {/* 대댓글 목록 */}
          {replies.length > 0 && (
            <VStack spacing={2} align="stretch" pl={4} mt={2}>
              {replies.map((reply) => (
                <Box key={reply.commentReId} width="100%">
                  <Text fontSize="lg" color="gray.500">
                    ↪︎ 작성자: {reply.nickname}
                  </Text>
                  <Box justify="space-between" align="flex-start">
                    <HStack spacing={2} alignItems="flex-start" flex={1}>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        textColor={"blue.400"}
                      >
                        @{reply.targetName}
                      </Text>
                      {editingReplyId === reply.commentReId ? (
                        <VStack width="100%" align="stretch">
                          <Textarea
                            value={editingReplyContent}
                            onChange={(e) =>
                              setEditingReplyContent(e.target.value)
                            }
                            size="sm"
                            resize="vertical"
                            minHeight="100px"
                          />
                          <HStack justifyContent="flex-end">
                            <Button size="sm" onClick={handleReplyUpdate}>
                              저장
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setEditingReplyId(null)}
                            >
                              취소
                            </Button>
                          </HStack>
                        </VStack>
                      ) : (
                        <Text flex={1}>{reply.content}</Text>
                      )}
                    </HStack>
                    {!editingReplyId && (
                      <HStack spacing={2}>
                        {account.hasAccess(reply.memberId) && (
                          <>
                            <Button
                              size="xs"
                              onClick={() =>
                                handleReplyEdit(
                                  reply.commentReId,
                                  reply.content,
                                )
                              }
                            >
                              수정
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="red"
                              onClick={() =>
                                handleReplyDelete(reply.commentReId)
                              }
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </HStack>
                    )}
                  </Box>
                </Box>
              ))}
            </VStack>
          )}

          {/* 대댓글 작성 폼 */}
          <Box mt={4}>
            <Textarea
              placeholder="대댓글을 작성하세요"
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
            />
            <Button
              mt={2}
              colorScheme="blue"
              isLoading={isProcessing}
              onClick={handleNewReplySubmit}
            >
              대댓글 작성
            </Button>
          </Box>
        </VStack>
      </CardBody>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>리뷰 삭제</ModalHeader>
          <ModalBody>작성하신 리뷰를 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme="red"
              isLoading={isProcessing}
              onClick={handleClickDeleteReviewComment}
            >
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
