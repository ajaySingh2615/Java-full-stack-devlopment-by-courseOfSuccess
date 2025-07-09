package org.sortoutinnovation.greenmagic.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for bulk operation requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkOperationRequestDto {
    
    @NotNull(message = "Operation type is required")
    private String operation;
    
    @NotEmpty(message = "Product IDs are required")
    @JsonProperty("productIds")
    private List<Integer> productIds;
    
    private BulkOperationParameters parameters;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkOperationParameters {
        
        // Price update parameters
        private PriceUpdateParams priceUpdate;
        
        // Stock update parameters
        private StockUpdateParams stockUpdate;
        
        // Status change parameters
        private StatusChangeParams statusChange;
        
        // Category assignment parameters
        private CategoryAssignmentParams categoryAssignment;
        
        // Tag management parameters
        private TagManagementParams tagManagement;
        
        // Export parameters
        private ExportParams export;
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PriceUpdateParams {
            @NotNull(message = "Price update method is required")
            private String method; // percentage, fixed_amount, set_price
            
            @NotNull(message = "Price value is required")
            @Positive(message = "Price value must be positive")
            private BigDecimal value;
            
            private Boolean applyToVariants = false;
        }
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class StockUpdateParams {
            @NotNull(message = "Stock update method is required")
            private String method; // increase, decrease, set_quantity
            
            @NotNull(message = "Stock value is required")
            private Integer value;
            
            private Boolean applyToVariants = false;
        }
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class StatusChangeParams {
            @NotNull(message = "New status is required")
            private String newStatus; // active, inactive, draft
        }
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class CategoryAssignmentParams {
            @NotNull(message = "Category ID is required")
            private Integer categoryId;
            
            private Integer subcategoryId;
        }
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class TagManagementParams {
            @NotNull(message = "Tag management method is required")
            private String method; // add_tags, remove_tags, replace_tags
            
            @NotEmpty(message = "Tags are required")
            private List<String> tags;
        }
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ExportParams {
            @NotNull(message = "Export format is required")
            private String format; // csv, excel, pdf
            
            private Boolean includeVariants = false;
            private Boolean includeImages = false;
        }
    }
} 