package com.devtechnology.devlibrary.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A CatalogEntry.
 */
@Entity
@Table(name = "catalog_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "catalogentry")
public class CatalogEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "inventory_count")
    private Long inventoryCount;

    @OneToOne
    @JoinColumn(unique = true)
    private Book book;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInventoryCount() {
        return inventoryCount;
    }

    public CatalogEntry inventoryCount(Long inventoryCount) {
        this.inventoryCount = inventoryCount;
        return this;
    }

    public void setInventoryCount(Long inventoryCount) {
        this.inventoryCount = inventoryCount;
    }

    public Book getBook() {
        return book;
    }

    public CatalogEntry book(Book book) {
        this.book = book;
        return this;
    }

    public void setBook(Book book) {
        this.book = book;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CatalogEntry)) {
            return false;
        }
        return id != null && id.equals(((CatalogEntry) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "CatalogEntry{" +
            "id=" + getId() +
            ", inventoryCount=" + getInventoryCount() +
            "}";
    }
}
