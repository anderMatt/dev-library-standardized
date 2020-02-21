package com.devtechnology.devlibrary.repository.search;

import com.devtechnology.devlibrary.domain.CatalogEntry;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link CatalogEntry} entity.
 */
public interface CatalogEntrySearchRepository extends ElasticsearchRepository<CatalogEntry, Long> {
}
