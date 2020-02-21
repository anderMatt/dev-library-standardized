package com.devtechnology.devlibrary.web.rest;

import com.devtechnology.devlibrary.DevLibraryApp;
import com.devtechnology.devlibrary.domain.BookLoan;
import com.devtechnology.devlibrary.repository.BookLoanRepository;
import com.devtechnology.devlibrary.repository.search.BookLoanSearchRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link BookLoanResource} REST controller.
 */
@SpringBootTest(classes = DevLibraryApp.class)
public class BookLoanResourceIT {

    private static final Instant DEFAULT_CHECK_OUT_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CHECK_OUT_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DUE_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DUE_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_RETURNED_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_RETURNED_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private BookLoanRepository bookLoanRepository;

    /**
     * This repository is mocked in the com.devtechnology.devlibrary.repository.search test package.
     *
     * @see com.devtechnology.devlibrary.repository.search.BookLoanSearchRepositoryMockConfiguration
     */
    @Autowired
    private BookLoanSearchRepository mockBookLoanSearchRepository;

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

    private MockMvc restBookLoanMockMvc;

    private BookLoan bookLoan;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BookLoanResource bookLoanResource = new BookLoanResource(bookLoanRepository, mockBookLoanSearchRepository);
        this.restBookLoanMockMvc = MockMvcBuilders.standaloneSetup(bookLoanResource)
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
    public static BookLoan createEntity(EntityManager em) {
        BookLoan bookLoan = new BookLoan()
            .checkOutDateTime(DEFAULT_CHECK_OUT_DATE_TIME)
            .dueDateTime(DEFAULT_DUE_DATE_TIME)
            .returnedDateTime(DEFAULT_RETURNED_DATE_TIME);
        return bookLoan;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookLoan createUpdatedEntity(EntityManager em) {
        BookLoan bookLoan = new BookLoan()
            .checkOutDateTime(UPDATED_CHECK_OUT_DATE_TIME)
            .dueDateTime(UPDATED_DUE_DATE_TIME)
            .returnedDateTime(UPDATED_RETURNED_DATE_TIME);
        return bookLoan;
    }

    @BeforeEach
    public void initTest() {
        bookLoan = createEntity(em);
    }

    @Test
    @Transactional
    public void createBookLoan() throws Exception {
        int databaseSizeBeforeCreate = bookLoanRepository.findAll().size();

        // Create the BookLoan
        restBookLoanMockMvc.perform(post("/api/book-loans")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bookLoan)))
            .andExpect(status().isCreated());

        // Validate the BookLoan in the database
        List<BookLoan> bookLoanList = bookLoanRepository.findAll();
        assertThat(bookLoanList).hasSize(databaseSizeBeforeCreate + 1);
        BookLoan testBookLoan = bookLoanList.get(bookLoanList.size() - 1);
        assertThat(testBookLoan.getCheckOutDateTime()).isEqualTo(DEFAULT_CHECK_OUT_DATE_TIME);
        assertThat(testBookLoan.getDueDateTime()).isEqualTo(DEFAULT_DUE_DATE_TIME);
        assertThat(testBookLoan.getReturnedDateTime()).isEqualTo(DEFAULT_RETURNED_DATE_TIME);

        // Validate the BookLoan in Elasticsearch
        verify(mockBookLoanSearchRepository, times(1)).save(testBookLoan);
    }

    @Test
    @Transactional
    public void createBookLoanWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bookLoanRepository.findAll().size();

        // Create the BookLoan with an existing ID
        bookLoan.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookLoanMockMvc.perform(post("/api/book-loans")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bookLoan)))
            .andExpect(status().isBadRequest());

        // Validate the BookLoan in the database
        List<BookLoan> bookLoanList = bookLoanRepository.findAll();
        assertThat(bookLoanList).hasSize(databaseSizeBeforeCreate);

        // Validate the BookLoan in Elasticsearch
        verify(mockBookLoanSearchRepository, times(0)).save(bookLoan);
    }


    @Test
    @Transactional
    public void getAllBookLoans() throws Exception {
        // Initialize the database
        bookLoanRepository.saveAndFlush(bookLoan);

        // Get all the bookLoanList
        restBookLoanMockMvc.perform(get("/api/book-loans?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookLoan.getId().intValue())))
            .andExpect(jsonPath("$.[*].checkOutDateTime").value(hasItem(DEFAULT_CHECK_OUT_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].dueDateTime").value(hasItem(DEFAULT_DUE_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].returnedDateTime").value(hasItem(DEFAULT_RETURNED_DATE_TIME.toString())));
    }
    
    @Test
    @Transactional
    public void getBookLoan() throws Exception {
        // Initialize the database
        bookLoanRepository.saveAndFlush(bookLoan);

        // Get the bookLoan
        restBookLoanMockMvc.perform(get("/api/book-loans/{id}", bookLoan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bookLoan.getId().intValue()))
            .andExpect(jsonPath("$.checkOutDateTime").value(DEFAULT_CHECK_OUT_DATE_TIME.toString()))
            .andExpect(jsonPath("$.dueDateTime").value(DEFAULT_DUE_DATE_TIME.toString()))
            .andExpect(jsonPath("$.returnedDateTime").value(DEFAULT_RETURNED_DATE_TIME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBookLoan() throws Exception {
        // Get the bookLoan
        restBookLoanMockMvc.perform(get("/api/book-loans/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBookLoan() throws Exception {
        // Initialize the database
        bookLoanRepository.saveAndFlush(bookLoan);

        int databaseSizeBeforeUpdate = bookLoanRepository.findAll().size();

        // Update the bookLoan
        BookLoan updatedBookLoan = bookLoanRepository.findById(bookLoan.getId()).get();
        // Disconnect from session so that the updates on updatedBookLoan are not directly saved in db
        em.detach(updatedBookLoan);
        updatedBookLoan
            .checkOutDateTime(UPDATED_CHECK_OUT_DATE_TIME)
            .dueDateTime(UPDATED_DUE_DATE_TIME)
            .returnedDateTime(UPDATED_RETURNED_DATE_TIME);

        restBookLoanMockMvc.perform(put("/api/book-loans")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedBookLoan)))
            .andExpect(status().isOk());

        // Validate the BookLoan in the database
        List<BookLoan> bookLoanList = bookLoanRepository.findAll();
        assertThat(bookLoanList).hasSize(databaseSizeBeforeUpdate);
        BookLoan testBookLoan = bookLoanList.get(bookLoanList.size() - 1);
        assertThat(testBookLoan.getCheckOutDateTime()).isEqualTo(UPDATED_CHECK_OUT_DATE_TIME);
        assertThat(testBookLoan.getDueDateTime()).isEqualTo(UPDATED_DUE_DATE_TIME);
        assertThat(testBookLoan.getReturnedDateTime()).isEqualTo(UPDATED_RETURNED_DATE_TIME);

        // Validate the BookLoan in Elasticsearch
        verify(mockBookLoanSearchRepository, times(1)).save(testBookLoan);
    }

    @Test
    @Transactional
    public void updateNonExistingBookLoan() throws Exception {
        int databaseSizeBeforeUpdate = bookLoanRepository.findAll().size();

        // Create the BookLoan

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookLoanMockMvc.perform(put("/api/book-loans")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bookLoan)))
            .andExpect(status().isBadRequest());

        // Validate the BookLoan in the database
        List<BookLoan> bookLoanList = bookLoanRepository.findAll();
        assertThat(bookLoanList).hasSize(databaseSizeBeforeUpdate);

        // Validate the BookLoan in Elasticsearch
        verify(mockBookLoanSearchRepository, times(0)).save(bookLoan);
    }

    @Test
    @Transactional
    public void deleteBookLoan() throws Exception {
        // Initialize the database
        bookLoanRepository.saveAndFlush(bookLoan);

        int databaseSizeBeforeDelete = bookLoanRepository.findAll().size();

        // Delete the bookLoan
        restBookLoanMockMvc.perform(delete("/api/book-loans/{id}", bookLoan.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BookLoan> bookLoanList = bookLoanRepository.findAll();
        assertThat(bookLoanList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the BookLoan in Elasticsearch
        verify(mockBookLoanSearchRepository, times(1)).deleteById(bookLoan.getId());
    }

    @Test
    @Transactional
    public void searchBookLoan() throws Exception {
        // Initialize the database
        bookLoanRepository.saveAndFlush(bookLoan);
        when(mockBookLoanSearchRepository.search(queryStringQuery("id:" + bookLoan.getId())))
            .thenReturn(Collections.singletonList(bookLoan));
        // Search the bookLoan
        restBookLoanMockMvc.perform(get("/api/_search/book-loans?query=id:" + bookLoan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookLoan.getId().intValue())))
            .andExpect(jsonPath("$.[*].checkOutDateTime").value(hasItem(DEFAULT_CHECK_OUT_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].dueDateTime").value(hasItem(DEFAULT_DUE_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].returnedDateTime").value(hasItem(DEFAULT_RETURNED_DATE_TIME.toString())));
    }
}
