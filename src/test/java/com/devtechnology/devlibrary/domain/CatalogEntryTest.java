package com.devtechnology.devlibrary.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.devtechnology.devlibrary.web.rest.TestUtil;

public class CatalogEntryTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CatalogEntry.class);
        CatalogEntry catalogEntry1 = new CatalogEntry();
        catalogEntry1.setId(1L);
        CatalogEntry catalogEntry2 = new CatalogEntry();
        catalogEntry2.setId(catalogEntry1.getId());
        assertThat(catalogEntry1).isEqualTo(catalogEntry2);
        catalogEntry2.setId(2L);
        assertThat(catalogEntry1).isNotEqualTo(catalogEntry2);
        catalogEntry1.setId(null);
        assertThat(catalogEntry1).isNotEqualTo(catalogEntry2);
    }
}
