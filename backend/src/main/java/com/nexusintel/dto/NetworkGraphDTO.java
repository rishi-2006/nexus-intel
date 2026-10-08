package com.nexusintel.dto;

import java.util.ArrayList;
import java.util.List;

public class NetworkGraphDTO {

    private List<NetworkNodeDTO> nodes = new ArrayList<>();
    private List<NetworkLinkDTO> links = new ArrayList<>();

    public NetworkGraphDTO() {
    }

    public NetworkGraphDTO(List<NetworkNodeDTO> nodes, List<NetworkLinkDTO> links) {
        this.nodes = nodes != null ? nodes : new ArrayList<>();
        this.links = links != null ? links : new ArrayList<>();
    }

    public List<NetworkNodeDTO> getNodes() {
        return nodes;
    }

    public void setNodes(List<NetworkNodeDTO> nodes) {
        this.nodes = nodes;
    }

    public List<NetworkLinkDTO> getLinks() {
        return links;
    }

    public void setLinks(List<NetworkLinkDTO> links) {
        this.links = links;
    }
}
