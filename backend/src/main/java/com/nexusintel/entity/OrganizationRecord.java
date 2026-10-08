package com.nexusintel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "organizations")
public class OrganizationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "org_name", nullable = false, length = 150)
    private String orgName;

    @Column(name = "registration_number", length = 50)
    private String registrationNumber;

    @Column(length = 100)
    private String industry;

    @Column(length = 150)
    private String headquarters;

    @Column(name = "principal_entity_ref", length = 50)
    private String principalEntityRef;

    public OrganizationRecord() {
    }

    public OrganizationRecord(String orgName, String registrationNumber, String industry, String headquarters, String principalEntityRef) {
        this.orgName = orgName;
        this.registrationNumber = registrationNumber;
        this.industry = industry;
        this.headquarters = headquarters;
        this.principalEntityRef = principalEntityRef;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getHeadquarters() {
        return headquarters;
    }

    public void setHeadquarters(String headquarters) {
        this.headquarters = headquarters;
    }

    public String getPrincipalEntityRef() {
        return principalEntityRef;
    }

    public void setPrincipalEntityRef(String principalEntityRef) {
        this.principalEntityRef = principalEntityRef;
    }
}
