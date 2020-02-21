package com.devtechnology.devlibrary.repository.search;

import com.devtechnology.devlibrary.domain.BookLoan;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link BookLoan} entity.
 */
public interface BookLoanSearchRepository extends ElasticsearchRepository<BookLoan, Long> {
}
