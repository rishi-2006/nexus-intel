package com.nexusintel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class VehicleRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String vin;

    @Column(name = "license_plate", length = 30)
    private String licensePlate;

    @Column(name = "make_model", length = 100)
    private String makeModel;

    @Column(length = 50)
    private String color;

    @Column(name = "owner_entity_ref", length = 50)
    private String ownerEntityRef;

    public VehicleRecord() {
    }

    public VehicleRecord(String vin, String licensePlate, String makeModel, String color, String ownerEntityRef) {
        this.vin = vin;
        this.licensePlate = licensePlate;
        this.makeModel = makeModel;
        this.color = color;
        this.ownerEntityRef = ownerEntityRef;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getMakeModel() {
        return makeModel;
    }

    public void setMakeModel(String makeModel) {
        this.makeModel = makeModel;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getOwnerEntityRef() {
        return ownerEntityRef;
    }

    public void setOwnerEntityRef(String ownerEntityRef) {
        this.ownerEntityRef = ownerEntityRef;
    }
}
