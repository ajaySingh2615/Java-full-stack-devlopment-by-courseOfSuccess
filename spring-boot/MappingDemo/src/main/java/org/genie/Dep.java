package org.genie;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Dep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "dep", cascade = CascadeType.ALL)
    private List<Emp> empList;
}
