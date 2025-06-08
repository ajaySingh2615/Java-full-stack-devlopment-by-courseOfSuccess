package org.genie;

import jakarta.persistence.*;

@Entity
public class Emp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dep_id")
    private Dep dep;
}
