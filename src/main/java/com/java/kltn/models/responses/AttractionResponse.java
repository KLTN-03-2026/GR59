package com.java.kltn.models.responses;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

// 3. ATTRACTION RESPONSE
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
public class AttractionResponse extends BasePlaceResponse {
    // Vì Attraction đã có sẵn category giống Base nên không cần thêm,
    // nhưng bạn có thể thêm các trường khác nếu muốn.
}