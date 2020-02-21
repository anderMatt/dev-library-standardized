package com.devtechnology.devlibrary.repository;

import com.devtechnology.devlibrary.domain.CatalogEntry;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the CatalogEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CatalogEntryRepository extends JpaRepository<CatalogEntry, Long> {

}
