package com.devtechnology.devlibrary.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link CatalogEntrySearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CatalogEntrySearchRepositoryMockConfiguration {

    @MockBean
    private CatalogEntrySearchRepository mockCatalogEntrySearchRepository;

}
