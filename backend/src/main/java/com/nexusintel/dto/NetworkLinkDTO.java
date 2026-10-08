package com.nexusintel.dto;

import com.nexusintel.entity.RelationshipType;

public class NetworkLinkDTO {

    private String id;
    private String source;
    private String target;
    private RelationshipType type;
    private Double weight;
    private String label;

    public NetworkLinkDTO() {
    }

    public NetworkLinkDTO(String id, String source, String target, RelationshipType type, Double weight, String label) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.type = type;
        this.weight = weight != null ? weight : 1.0;
        this.label = label;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public RelationshipType getType() {
        return type;
    }

    public void setType(RelationshipType type) {
        this.type = type;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
