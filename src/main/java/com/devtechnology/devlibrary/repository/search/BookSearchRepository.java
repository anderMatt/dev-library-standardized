package com.devtechnology.devlibrary.repository.search;

import com.devtechnology.devlibrary.domain.Book;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Book} entity.
 */
public interface BookSearchRepository extends ElasticsearchRepository<Book, Long> {
}
