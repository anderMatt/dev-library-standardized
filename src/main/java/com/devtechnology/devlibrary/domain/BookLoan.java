package com.devtechnology.devlibrary.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

/**
 * A BookLoan.
 */
@Entity
@Table(name = "book_loan")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "bookloan")
public class BookLoan implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "check_out_date_time")
    private Instant checkOutDateTime;

    @Column(name = "due_date_time")
    private Instant dueDateTime;

    @Column(name = "returned_date_time")
    private Instant returnedDateTime;

    @OneToOne
    @JoinColumn(unique = true)
    private Book book;

    @OneToOne
    @JoinColumn(unique = true)
    private User borrower;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCheckOutDateTime() {
        return checkOutDateTime;
    }

    public BookLoan checkOutDateTime(Instant checkOutDateTime) {
        this.checkOutDateTime = checkOutDateTime;
        return this;
    }

    public void setCheckOutDateTime(Instant checkOutDateTime) {
        this.checkOutDateTime = checkOutDateTime;
    }

    public Instant getDueDateTime() {
        return dueDateTime;
    }

    public BookLoan dueDateTime(Instant dueDateTime) {
        this.dueDateTime = dueDateTime;
        return this;
    }

    public void setDueDateTime(Instant dueDateTime) {
        this.dueDateTime = dueDateTime;
    }

    public Instant getReturnedDateTime() {
        return returnedDateTime;
    }

    public BookLoan returnedDateTime(Instant returnedDateTime) {
        this.returnedDateTime = returnedDateTime;
        return this;
    }

    public void setReturnedDateTime(Instant returnedDateTime) {
        this.returnedDateTime = returnedDateTime;
    }

    public Book getBook() {
        return book;
    }

    public BookLoan book(Book book) {
        this.book = book;
        return this;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public User getBorrower() {
        return borrower;
    }

    public BookLoan borrower(User user) {
        this.borrower = user;
        return this;
    }

    public void setBorrower(User user) {
        this.borrower = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BookLoan)) {
            return false;
        }
        return id != null && id.equals(((BookLoan) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "BookLoan{" +
            "id=" + getId() +
            ", checkOutDateTime='" + getCheckOutDateTime() + "'" +
            ", dueDateTime='" + getDueDateTime() + "'" +
            ", returnedDateTime='" + getReturnedDateTime() + "'" +
            "}";
    }
}
