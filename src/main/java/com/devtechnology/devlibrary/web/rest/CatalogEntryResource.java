package com.devtechnology.devlibrary.web.rest;

import com.devtechnology.devlibrary.domain.CatalogEntry;
import com.devtechnology.devlibrary.repository.CatalogEntryRepository;
import com.devtechnology.devlibrary.repository.search.CatalogEntrySearchRepository;
import com.devtechnology.devlibrary.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.devtechnology.devlibrary.domain.CatalogEntry}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CatalogEntryResource {

    private final Logger log = LoggerFactory.getLogger(CatalogEntryResource.class);

    private static final String ENTITY_NAME = "catalogEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CatalogEntryRepository catalogEntryRepository;

    private final CatalogEntrySearchRepository catalogEntrySearchRepository;

    public CatalogEntryResource(CatalogEntryRepository catalogEntryRepository, CatalogEntrySearchRepository catalogEntrySearchRepository) {
        this.catalogEntryRepository = catalogEntryRepository;
        this.catalogEntrySearchRepository = catalogEntrySearchRepository;
    }

    /**
     * {@code POST  /catalog-entries} : Create a new catalogEntry.
     *
     * @param catalogEntry the catalogEntry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new catalogEntry, or with status {@code 400 (Bad Request)} if the catalogEntry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/catalog-entries")
    public ResponseEntity<CatalogEntry> createCatalogEntry(@RequestBody CatalogEntry catalogEntry) throws URISyntaxException {
        log.debug("REST request to save CatalogEntry : {}", catalogEntry);
        if (catalogEntry.getId() != null) {
            throw new BadRequestAlertException("A new catalogEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CatalogEntry result = catalogEntryRepository.save(catalogEntry);
        catalogEntrySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/catalog-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /catalog-entries} : Updates an existing catalogEntry.
     *
     * @param catalogEntry the catalogEntry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated catalogEntry,
     * or with status {@code 400 (Bad Request)} if the catalogEntry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the catalogEntry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/catalog-entries")
    public ResponseEntity<CatalogEntry> updateCatalogEntry(@RequestBody CatalogEntry catalogEntry) throws URISyntaxException {
        log.debug("REST request to update CatalogEntry : {}", catalogEntry);
        if (catalogEntry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CatalogEntry result = catalogEntryRepository.save(catalogEntry);
        catalogEntrySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, catalogEntry.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /catalog-entries} : get all the catalogEntries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of catalogEntries in body.
     */
    @GetMapping("/catalog-entries")
    public List<CatalogEntry> getAllCatalogEntries() {
        log.debug("REST request to get all CatalogEntries");
        return catalogEntryRepository.findAll();
    }

    /**
     * {@code GET  /catalog-entries/:id} : get the "id" catalogEntry.
     *
     * @param id the id of the catalogEntry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the catalogEntry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/catalog-entries/{id}")
    public ResponseEntity<CatalogEntry> getCatalogEntry(@PathVariable Long id) {
        log.debug("REST request to get CatalogEntry : {}", id);
        Optional<CatalogEntry> catalogEntry = catalogEntryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(catalogEntry);
    }

    /**
     * {@code DELETE  /catalog-entries/:id} : delete the "id" catalogEntry.
     *
     * @param id the id of the catalogEntry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/catalog-entries/{id}")
    public ResponseEntity<Void> deleteCatalogEntry(@PathVariable Long id) {
        log.debug("REST request to delete CatalogEntry : {}", id);
        catalogEntryRepository.deleteById(id);
        catalogEntrySearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/catalog-entries?query=:query} : search for the catalogEntry corresponding
     * to the query.
     *
     * @param query the query of the catalogEntry search.
     * @return the result of the search.
     */
    @GetMapping("/_search/catalog-entries")
    public List<CatalogEntry> searchCatalogEntries(@RequestParam String query) {
        log.debug("REST request to search CatalogEntries for query {}", query);
        return StreamSupport
            .stream(catalogEntrySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
