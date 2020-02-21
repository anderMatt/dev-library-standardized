package com.devtechnology.devlibrary.repository;

import com.devtechnology.devlibrary.domain.BookLoan;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the BookLoan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookLoanRepository extends JpaRepository<BookLoan, Long> {

}
