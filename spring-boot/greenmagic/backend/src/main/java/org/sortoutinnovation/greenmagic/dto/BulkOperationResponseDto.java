package org.sortoutinnovation.greenmagic.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for bulk operation responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkOperationResponseDto {
    
    private String operationId;
    private String status; // pending, processing, completed, failed
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ProgressInfo progress;
    private OperationResults results;
    private String downloadUrl; // for export operations
    private String undoToken; // for undoable operations
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgressInfo {
        private Integer total;
        private Integer processed;
        private Integer successful;
        private Integer failed;
        private String currentPhase;
        private Double percentage;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OperationResults {
        private List<Integer> successfulIds;
        private List<FailedItem> failedItems;
        private String summary;
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class FailedItem {
            private Integer productId;
            private String productName;
            private String errorMessage;
            private String errorCode;
        }
    }
} 