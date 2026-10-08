package com.nexusintel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "phones")
public class PhoneRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber;

    @Column(length = 50)
    private String carrier;

    @Column(length = 50)
    private String imei;

    @Column(name = "subscriber_entity_ref", length = 50)
    private String subscriberEntityRef;

    public PhoneRecord() {
    }

    public PhoneRecord(String phoneNumber, String carrier, String imei, String subscriberEntityRef) {
        this.phoneNumber = phoneNumber;
        this.carrier = carrier;
        this.imei = imei;
        this.subscriberEntityRef = subscriberEntityRef;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public String getIMEI() {
        return imei;
    }

    public void setIMEI(String imei) {
        this.imei = imei;
    }

    public String getSubscriberEntityRef() {
        return subscriberEntityRef;
    }

    public void setSubscriberEntityRef(String subscriberEntityRef) {
        this.subscriberEntityRef = subscriberEntityRef;
    }
}
