package com.devtechnology.devlibrary.web.rest;

import com.devtechnology.devlibrary.DevLibraryApp;
import com.devtechnology.devlibrary.domain.CatalogEntry;
import com.devtechnology.devlibrary.repository.CatalogEntryRepository;
import com.devtechnology.devlibrary.repository.search.CatalogEntrySearchRepository;
import com.devtechnology.devlibrary.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.devtechnology.devlibrary.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link CatalogEntryResource} REST controller.
 */
@SpringBootTest(classes = DevLibraryApp.class)
public class CatalogEntryResourceIT {

    private static final Long DEFAULT_INVENTORY_COUNT = 1L;
    private static final Long UPDATED_INVENTORY_COUNT = 2L;

    @Autowired
    private CatalogEntryRepository catalogEntryRepository;

    /**
     * This repository is mocked in the com.devtechnology.devlibrary.repository.search test package.
     *
     * @see com.devtechnology.devlibrary.repository.search.CatalogEntrySearchRepositoryMockConfiguration
     */
    @Autowired
    private CatalogEntrySearchRepository mockCatalogEntrySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCatalogEntryMockMvc;

    private CatalogEntry catalogEntry;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CatalogEntryResource catalogEntryResource = new CatalogEntryResource(catalogEntryRepository, mockCatalogEntrySearchRepository);
        this.restCatalogEntryMockMvc = MockMvcBuilders.standaloneSetup(catalogEntryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CatalogEntry createEntity(EntityManager em) {
        CatalogEntry catalogEntry = new CatalogEntry()
            .inventoryCount(DEFAULT_INVENTORY_COUNT);
        return catalogEntry;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CatalogEntry createUpdatedEntity(EntityManager em) {
        CatalogEntry catalogEntry = new CatalogEntry()
            .inventoryCount(UPDATED_INVENTORY_COUNT);
        return catalogEntry;
    }

    @BeforeEach
    public void initTest() {
        catalogEntry = createEntity(em);
    }

    @Test
    @Transactional
    public void createCatalogEntry() throws Exception {
        int databaseSizeBeforeCreate = catalogEntryRepository.findAll().size();

        // Create the CatalogEntry
        restCatalogEntryMockMvc.perform(post("/api/catalog-entries")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(catalogEntry)))
            .andExpect(status().isCreated());

        // Validate the CatalogEntry in the database
        List<CatalogEntry> catalogEntryList = catalogEntryRepository.findAll();
        assertThat(catalogEntryList).hasSize(databaseSizeBeforeCreate + 1);
        CatalogEntry testCatalogEntry = catalogEntryList.get(catalogEntryList.size() - 1);
        assertThat(testCatalogEntry.getInventoryCount()).isEqualTo(DEFAULT_INVENTORY_COUNT);

        // Validate the CatalogEntry in Elasticsearch
        verify(mockCatalogEntrySearchRepository, times(1)).save(testCatalogEntry);
    }

    @Test
    @Transactional
    public void createCatalogEntryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = catalogEntryRepository.findAll().size();

        // Create the CatalogEntry with an existing ID
        catalogEntry.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCatalogEntryMockMvc.perform(post("/api/catalog-entries")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(catalogEntry)))
            .andExpect(status().isBadRequest());

        // Validate the CatalogEntry in the database
        List<CatalogEntry> catalogEntryList = catalogEntryRepository.findAll();
        assertThat(catalogEntryList).hasSize(databaseSizeBeforeCreate);

        // Validate the CatalogEntry in Elasticsearch
        verify(mockCatalogEntrySearchRepository, times(0)).save(catalogEntry);
    }


    @Test
    @Transactional
    public void getAllCatalogEntries() throws Exception {
        // Initialize the database
        catalogEntryRepository.saveAndFlush(catalogEntry);

        // Get all the catalogEntryList
        restCatalogEntryMockMvc.perform(get("/api/catalog-entries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(catalogEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].inventoryCount").value(hasItem(DEFAULT_INVENTORY_COUNT.intValue())));
    }
    
    @Test
    @Transactional
    public void getCatalogEntry() throws Exception {
        // Initialize the database
        catalogEntryRepository.saveAndFlush(catalogEntry);

        // Get the catalogEntry
        restCatalogEntryMockMvc.perform(get("/api/catalog-entries/{id}", catalogEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(catalogEntry.getId().intValue()))
            .andExpect(jsonPath("$.inventoryCount").value(DEFAULT_INVENTORY_COUNT.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingCatalogEntry() throws Exception {
        // Get the catalogEntry
        restCatalogEntryMockMvc.perform(get("/api/catalog-entries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCatalogEntry() throws Exception {
        // Initialize the database
        catalogEntryRepository.saveAndFlush(catalogEntry);

        int databaseSizeBeforeUpdate = catalogEntryRepository.findAll().size();

        // Update the catalogEntry
        CatalogEntry updatedCatalogEntry = catalogEntryRepository.findById(catalogEntry.getId()).get();
        // Disconnect from session so that the updates on updatedCatalogEntry are not directly saved in db
        em.detach(updatedCatalogEntry);
        updatedCatalogEntry
            .inventoryCount(UPDATED_INVENTORY_COUNT);

        restCatalogEntryMockMvc.perform(put("/api/catalog-entries")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCatalogEntry)))
            .andExpect(status().isOk());

        // Validate the CatalogEntry in the database
        List<CatalogEntry> catalogEntryList = catalogEntryRepository.findAll();
        assertThat(catalogEntryList).hasSize(databaseSizeBeforeUpdate);
        CatalogEntry testCatalogEntry = catalogEntryList.get(catalogEntryList.size() - 1);
        assertThat(testCatalogEntry.getInventoryCount()).isEqualTo(UPDATED_INVENTORY_COUNT);

        // Validate the CatalogEntry in Elasticsearch
        verify(mockCatalogEntrySearchRepository, times(1)).save(testCatalogEntry);
    }

    @Test
    @Transactional
    public void updateNonExistingCatalogEntry() throws Exception {
        int databaseSizeBeforeUpdate = catalogEntryRepository.findAll().size();

        // Create the CatalogEntry

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCatalogEntryMockMvc.perform(put("/api/catalog-entries")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(catalogEntry)))
            .andExpect(status().isBadRequest());

        // Validate the CatalogEntry in the database
        List<CatalogEntry> catalogEntryList = catalogEntryRepository.findAll();
        assertThat(catalogEntryList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CatalogEntry in Elasticsearch
        verify(mockCatalogEntrySearchRepository, times(0)).save(catalogEntry);
    }

    @Test
    @Transactional
    public void deleteCatalogEntry() throws Exception {
        // Initialize the database
        catalogEntryRepository.saveAndFlush(catalogEntry);

        int databaseSizeBeforeDelete = catalogEntryRepository.findAll().size();

        // Delete the catalogEntry
        restCatalogEntryMockMvc.perform(delete("/api/catalog-entries/{id}", catalogEntry.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CatalogEntry> catalogEntryList = catalogEntryRepository.findAll();
        assertThat(catalogEntryList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CatalogEntry in Elasticsearch
        verify(mockCatalogEntrySearchRepository, times(1)).deleteById(catalogEntry.getId());
    }

    @Test
    @Transactional
    public void searchCatalogEntry() throws Exception {
        // Initialize the database
        catalogEntryRepository.saveAndFlush(catalogEntry);
        when(mockCatalogEntrySearchRepository.search(queryStringQuery("id:" + catalogEntry.getId())))
            .thenReturn(Collections.singletonList(catalogEntry));
        // Search the catalogEntry
        restCatalogEntryMockMvc.perform(get("/api/_search/catalog-entries?query=id:" + catalogEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(catalogEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].inventoryCount").value(hasItem(DEFAULT_INVENTORY_COUNT.intValue())));
    }
}
