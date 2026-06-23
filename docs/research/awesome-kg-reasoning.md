# Awesome-Knowledge-Graph-Reasoning — a research-paper index for KG reasoning, organized by model architecture (embeddings → GNNs → rules → temporal/multimodal)

- **URL / stars / activity:** https://github.com/LIANGKE23/Awesome-Knowledge-Graph-Reasoning — ~7 stars (small/low-visibility), ~154 commits, papers span 2011–2025 with 2024/2025 entries present, so actively curated; maintained by an individual (contact liangke200694@gmail.com) tied to a 2024 IEEE TPAMI survey on static/dynamic/multi-modal KGs. No license stated.
- **Type:** awesome-list / paper-collection (academic literature index, not a tutorial or code library). Most entries link to paper + GitHub code.
- **What it is:** A curated bibliography of knowledge-graph-reasoning research, structured to mirror the authors' TPAMI survey. It catalogs hundreds of methods for *link prediction / KG completion* and reasoning, grouped by the underlying model architecture, plus datasets and benchmark links. It is comprehensive on embedding/GNN/rule families and on temporal and multi-modal extensions, but it is squarely an academic ML-on-KG resource — it does not cover symbolic OWL/Description-Logic reasoning at all.

## Taxonomy of KG reasoning (as the repo organizes it)

Top level splits by KG *type*, then by model architecture:

1. **Static KG Reasoning**
   - **Translational / geometric models** (TransE family): largest bucket, 80+ papers
   - **Tensor-decomposition models**: ComplEx, RESCAL, TuckER, QuatE, SimplE, HolE
   - **Neural-network models**: traditional NN (SME, NTN, ProjE); CNN-based (ConvE, ConvKB, InteractE); **GNN-based** (R-GCN, CompGCN, GraIL, NBFNet…); **Transformer-based** (KG-BERT, HittER, KnowFormer)
   - **Path-based models**: MINERVA, DeepPath, A*Net (multi-hop / RL walk reasoning)
   - **Rule-based / neuro-symbolic models**: NeuralLP, DRUM, RLogic
2. **Temporal KG Reasoning** — RNN-based (quadruple/path/graph variants) vs RNN-agnostic (time-vector-guided, time-operation-guided): xERTE, CyGNet, TiRGN, TuckER-TNT
3. **Multi-Modal KG Reasoning** — Transformer-agnostic vs Transformer-based fusion of KG + image/text: MKGAT, MoSE, OTKGE
4. **Survey Papers**, **Datasets** (transductive vs inductive; temporal; multi-modal), **Useful Libraries**

The reasoning paradigms, in builder's terms, are: **embedding/geometric**, **tensor-factorization**, **GNN message-passing (incl. inductive)**, **path/RL multi-hop**, **rule-mining / differentiable-logic (neuro-symbolic)**, and architecturally **transformer**, with **temporal** and **multimodal** as orthogonal axes.

## Key methods/papers named

Classic / foundational:
- **TransE** (2013) — translation embedding h+r≈t; the canonical baseline.
- **ComplEx / RESCAL** — tensor/bilinear factorization for link prediction.
- **RotatE** — relations as rotations in complex space; handles symmetry/inversion/composition.
- **ConvE** — CNN over reshaped embeddings; first strong "deep" KG-completion model.
- **R-GCN / CompGCN** — GNNs that aggregate relational neighborhoods (transductive completion).
- **DeepPath / MINERVA** — reinforcement-learning path-walkers for multi-hop reasoning (explainable).
- **NeuralLP / DRUM** — differentiable rule learning (neuro-symbolic; learn logical rules end-to-end).
- **KG-BERT** — frames triple plausibility as a BERT sequence-classification task (early LM-for-KG).

Inductive / recent (2023–2025, "reasoning over unseen entities" era):
- **GraIL, NBFNet, A\*Net** — inductive/subgraph & path-based GNN reasoning that generalizes to new entities.
- **KnowFormer / HittER** — transformer architectures for KG reasoning.
- **RLogic** — recursive logical-rule learning (neuro-symbolic, recent).
- **GoldE, NestE, MGTCA, ReED, FS-KEN (2025)** — 2024–2025 embedding/GNN advances (orthogonal/geometric parameterizations, nested relations, mixed-geometry attention, generalization bounds, few-shot).

Note: only **one LLM-era entry** appears — the 2023 survey *"Unifying Large Language Models and Knowledge Graphs: A Roadmap"* (which points to the separate RManLuo/Awesome-LLM-KG list). This repo is **not** an LLM-reasoning resource.

## Relevance to a "second brain" curriculum

- This list answers "*can you reason over a KG, and how?*" strictly from the **machine-learning / latent-representation** angle: reasoning = predicting missing edges (link prediction / KG completion) and multi-hop query answering, not deductive entailment over an ontology.
- The **symbolic vs neural vs neurosymbolic spread**, as represented here:
  - **Symbolic (OWL/DL/RDFS reasoning, SPARQL inference, rule engines):** *absent.* A second-brain builder must source this elsewhere — it is the classic deductive "what is entailed" capability.
  - **Neural:** dominant — embeddings (TransE/RotatE/ComplEx), GNNs (R-GCN/NBFNet), transformers. Good for noisy/incomplete personal graphs where you want *plausible* inferred links rather than provable ones.
  - **Neurosymbolic / rule-based:** the bridge — NeuralLP, DRUM, RLogic learn human-readable rules that approximate logical reasoning while staying differentiable; path-based RL (MINERVA) adds explainable multi-hop chains.
- For a curriculum, the minimum a builder should understand: (1) **TransE/RotatE/ComplEx** as the embedding mental model; (2) one **GNN completion** method (R-GCN or NBFNet) and the transductive-vs-**inductive** distinction (does it work on entities never seen at training?); (3) one **rule-learning / neuro-symbolic** method (NeuralLP) to connect back to symbolic logic; (4) **multi-hop path reasoning** (MINERVA) for explainability. Pair this with a separate symbolic-reasoning unit (OWL/DL, SHACL/SPARQL) to cover the deductive side this list omits.

## Caveats

- **Research-heavy, not practical.** It is a bibliography of academic methods (link prediction on FB15k/WN18RR-style benchmarks); no install/usage guidance, no production-tooling guidance. The "Useful Libraries" section is the only operational pointer.
- **Scope gap for a second brain:** it equates "KG reasoning" with embedding/GNN link prediction. It contains **no symbolic/ontology reasoning** and **almost no LLM-based reasoning** — both of which are central to a modern personal-KG "reasoning" story. Treat it as the deep reference for the *neural* branch only, and complement it with an OWL/DL resource and an LLM-KG resource (e.g. Awesome-LLM-KG, which it links once).
- **Low community footprint** (~7 stars), so verify currency against the underlying TPAMI 2024 survey rather than relying on the list's completeness.
