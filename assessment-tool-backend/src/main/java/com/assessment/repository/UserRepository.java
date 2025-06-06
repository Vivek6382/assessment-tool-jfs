package com.assessment.repository;

import com.assessment.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

	@Query("SELECT u FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'EDUCATOR' AND UPPER(u.userStatus) = 'ACTIVE'")
    List<User> findActiveEducators();
    
    @Query("SELECT u FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'EDUCATOR' AND UPPER(u.userStatus) = 'INACTIVE'")
    List<User> findInactiveEducators();
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'EDUCATOR' AND UPPER(u.userStatus) = 'ACTIVE'")
    Long countActiveEducators();
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'EDUCATOR'")
    Long countTotalEducators();
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'EDUCATOR' AND UPPER(u.userStatus) = 'INACTIVE'")
    Long countInactiveEducators();
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'STUDENT'")
    Long countTotalStudents();
    
    @Query("SELECT u FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'STUDENT' AND UPPER(u.userStatus) = 'ACTIVE'")
    List<User> findActiveStudents();
    
    @Query("SELECT u FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'STUDENT' AND UPPER(u.userStatus) = 'INACTIVE'")
    List<User> findInactiveStudents();
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE UPPER(r.roleName) = 'STUDENT' AND UPPER(u.userStatus) = 'ACTIVE'")
    Long countActiveStudents();

	Optional<User> findByUsername(String username);

	User findByUserEmail(String email);
	
    List<User> findByRole_RoleId(Integer roleId);

	boolean existsByUserEmail(String email);

}
