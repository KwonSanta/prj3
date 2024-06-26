package com.backend.file.controller;

import com.backend.file.domain.File;
import com.backend.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
public class FileController {

    private final FileService fileService;

    @GetMapping("/space/list")
    public List<File> selectAllOfSpaces() {
        return fileService.selectAllOfSpaces();
    }

    @GetMapping("/type/list")
    public List<File> selectAllOfTypes() {
        return fileService.selectAllOfTypes();
    }

    @PostMapping("/upload/icon")
    public ResponseEntity<String> uploadIcon(
            @RequestParam("file") MultipartFile file,
            @RequestParam("parentId") int parentId,
            @RequestParam("division") String division) {
        System.out.println("========/upload/ic/upload/ic=========================");
        try {
            fileService.addOrUpdateFile(division, parentId, file);
            return ResponseEntity.ok("파일을 정상적으로 업로드하였습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("파일 업로드에 실패했습니다.");
        }
    }

    @DeleteMapping("/icon/{fileId}")
    public ResponseEntity<String> deleteFileIcon(@PathVariable("fileId") int fileId) {
        try {
            fileService.deleteFileById(fileId);
            return ResponseEntity.ok("파일이 정상적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("파일 삭제에 실패했습니다.");
        }
    }
}
