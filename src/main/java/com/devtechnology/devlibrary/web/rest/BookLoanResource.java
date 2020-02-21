package com.devtechnology.devlibrary.web.rest;

import com.devtechnology.devlibrary.domain.BookLoan;
import com.devtechnology.devlibrary.repository.BookLoanRepository;
import com.devtechnology.devlibrary.repository.search.BookLoanSearchRepository;
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
 * REST controller for managing {@link com.devtechnology.devlibrary.domain.BookLoan}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookLoanResource {

    private final Logger log = LoggerFactory.getLogger(BookLoanResource.class);

    private static final String ENTITY_NAME = "bookLoan";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookLoanRepository bookLoanRepository;

    private final BookLoanSearchRepository bookLoanSearchRepository;

    public BookLoanResource(BookLoanRepository bookLoanRepository, BookLoanSearchRepository bookLoanSearchRepository) {
        this.bookLoanRepository = bookLoanRepository;
        this.bookLoanSearchRepository = bookLoanSearchRepository;
    }

    /**
     * {@code POST  /book-loans} : Create a new bookLoan.
     *
     * @param bookLoan the bookLoan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookLoan, or with status {@code 400 (Bad Request)} if the bookLoan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/book-loans")
    public ResponseEntity<BookLoan> createBookLoan(@RequestBody BookLoan bookLoan) throws URISyntaxException {
        log.debug("REST request to save BookLoan : {}", bookLoan);
        if (bookLoan.getId() != null) {
            throw new BadRequestAlertException("A new bookLoan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BookLoan result = bookLoanRepository.save(bookLoan);
        bookLoanSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/book-loans/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /book-loans} : Updates an existing bookLoan.
     *
     * @param bookLoan the bookLoan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookLoan,
     * or with status {@code 400 (Bad Request)} if the bookLoan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookLoan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/book-loans")
    public ResponseEntity<BookLoan> updateBookLoan(@RequestBody BookLoan bookLoan) throws URISyntaxException {
        log.debug("REST request to update BookLoan : {}", bookLoan);
        if (bookLoan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BookLoan result = bookLoanRepository.save(bookLoan);
        bookLoanSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bookLoan.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /book-loans} : get all the bookLoans.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookLoans in body.
     */
    @GetMapping("/book-loans")
    public List<BookLoan> getAllBookLoans() {
        log.debug("REST request to get all BookLoans");
        return bookLoanRepository.findAll();
    }

    /**
     * {@code GET  /book-loans/:id} : get the "id" bookLoan.
     *
     * @param id the id of the bookLoan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookLoan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/book-loans/{id}")
    public ResponseEntity<BookLoan> getBookLoan(@PathVariable Long id) {
        log.debug("REST request to get BookLoan : {}", id);
        Optional<BookLoan> bookLoan = bookLoanRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bookLoan);
    }

    /**
     * {@code DELETE  /book-loans/:id} : delete the "id" bookLoan.
     *
     * @param id the id of the bookLoan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/book-loans/{id}")
    public ResponseEntity<Void> deleteBookLoan(@PathVariable Long id) {
        log.debug("REST request to delete BookLoan : {}", id);
        bookLoanRepository.deleteById(id);
        bookLoanSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/book-loans?query=:query} : search for the bookLoan corresponding
     * to the query.
     *
     * @param query the query of the bookLoan search.
     * @return the result of the search.
     */
    @GetMapping("/_search/book-loans")
    public List<BookLoan> searchBookLoans(@RequestParam String query) {
        log.debug("REST request to search BookLoans for query {}", query);
        return StreamSupport
            .stream(bookLoanSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
