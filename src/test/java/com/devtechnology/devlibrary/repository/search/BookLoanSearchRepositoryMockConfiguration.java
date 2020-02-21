package com.devtechnology.devlibrary.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link BookLoanSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class BookLoanSearchRepositoryMockConfiguration {

    @MockBean
    private BookLoanSearchRepository mockBookLoanSearchRepository;

}
