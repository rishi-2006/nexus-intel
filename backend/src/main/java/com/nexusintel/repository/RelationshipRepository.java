package com.nexusintel.repository;

import com.nexusintel.entity.Relationship;
import com.nexusintel.entity.RelationshipType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelationshipRepository extends JpaRepository<Relationship, Long> {

    @Query("SELECT r FROM Relationship r WHERE r.sourceEntity.id = :entityId OR r.targetEntity.id = :entityId")
    List<Relationship> findByEntityId(@Param("entityId") Long entityId);

    @Query("SELECT r FROM Relationship r WHERE (r.sourceEntity.id = :srcId AND r.targetEntity.id = :tgtId) OR (r.sourceEntity.id = :tgtId AND r.targetEntity.id = :srcId)")
    List<Relationship> findBetweenEntities(@Param("srcId") Long srcId, @Param("tgtId") Long tgtId);

    Page<Relationship> findByRelationshipType(RelationshipType relationshipType, Pageable pageable);
    long countByRelationshipType(RelationshipType relationshipType);

    @Query("SELECT r FROM Relationship r JOIN FETCH r.sourceEntity JOIN FETCH r.targetEntity")
    List<Relationship> findAllWithEntities();

    @Query("SELECT r FROM Relationship r JOIN FETCH r.sourceEntity JOIN FETCH r.targetEntity WHERE r.id = :id")
    Optional<Relationship> findByIdWithEntities(@Param("id") Long id);
}
