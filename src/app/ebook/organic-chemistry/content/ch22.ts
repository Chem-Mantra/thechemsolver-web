import type { OrgoChapter } from '../types'

export const CH22: OrgoChapter = {
  id: 'ch22',
  number: 22,
  title: 'Amino Acids & Peptides',
  orgo: 2,
  accentHex: '#a855f7',
  concepts: [

    // ── Concept 1: Amino Acid Structure, Stereochemistry & pKa ──────────────
    {
      id: 'ch22-c1-amino-acids',
      title: 'Amino Acid Structure & Acid-Base Chemistry',
      subtitle: 'Zwitterions, pKa values, isoelectric points, and the 20 standard amino acids',
      estimatedMinutes: 14,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'The 20 standard amino acids share a common structure: an α-carbon bearing an amino group (–NH₂), a carboxyl group (–COOH), a hydrogen atom, and a distinctive side chain (R group). In solution at physiological pH (~7.4), amino acids exist as zwitterions — the amino group is protonated (–NH₃⁺) and the carboxyl group is deprotonated (–COO⁻). The net charge is zero at the isoelectric point (pI), which equals the average of the two relevant pKa values.',
        },
        {
          type: 'formula',
          latex: '\\text{pI} = \\frac{\\text{p}K_{a1} + \\text{p}K_{a2}}{2}',
          display: true,
          caption: 'Isoelectric point (pI) for a simple amino acid (with no ionizable side chain): average of pKa1 (carboxyl group, ~2) and pKa2 (amino group, ~9–10). For amino acids with ionizable side chains, use the two pKa values flanking the neutral zwitterion form.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'Amino Acid Stereochemistry: L-Configuration',
          body: 'All 20 standard amino acids (except glycine, which has no stereocenter) are L-amino acids — they have the (S) configuration at the α-carbon by the CIP system (with one exception: cysteine, which is (R) due to the sulfur atom\'s higher atomic number changing the priority order).\n\nThe L/D convention in amino acids is analogous to carbohydrates:\n• L: –NH₂ on LEFT in Fischer projection (H₂N–C–COOH with the vertical chain C1=COOH at top)\n• D: –NH₂ on RIGHT\n\nBiological significance: only L-amino acids are incorporated by ribosomes. D-amino acids occur in bacterial cell walls (D-Ala, D-Glu in peptidoglycan) and some antibiotics (gramicidin), but not in standard proteins.\n\nGlycine (H₂NCH₂COOH) has R = H — the α-carbon has two identical H substituents → no stereocenter.',
        },
        {
          type: 'table',
          headers: ['Category', 'Amino acids', 'Side chain character', 'pI range'],
          rows: [
            ['Nonpolar, aliphatic', 'Gly, Ala, Val, Leu, Ile, Pro, Met', 'Hydrophobic alkyl/thioether', '5.9–6.3'],
            ['Aromatic', 'Phe, Trp, Tyr', 'Aromatic rings; Tyr has –OH (ionizable)', '5.5–5.9 (Tyr pI 5.7)'],
            ['Polar, uncharged', 'Ser, Thr, Cys, Asn, Gln', 'Hydroxyl, thiol, amide side chains', '5.1–6.3'],
            ['Basic (positive at pH 7)', 'Lys (ε-NH₃⁺), Arg (guanidinium), His (imidazolium)', 'Protonated basic groups; pI > 7', 'Lys 9.7, Arg 10.8, His 7.6'],
            ['Acidic (negative at pH 7)', 'Asp (β-COOH), Glu (γ-COOH)', 'Ionized carboxylate at pH 7; pI < 7', 'Asp 2.8, Glu 3.2'],
          ],
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'pI Calculation: The Key Rule',
          body: 'To find pI, you need to know which pKa values flank the NEUTRAL (zwitterionic) form:\n\nFor simple amino acid (e.g., alanine):\n• pKa1 = 2.3 (–COOH loses H⁺ → –COO⁻)\n• pKa2 = 9.7 (–NH₃⁺ loses H⁺ → –NH₂)\n• pI = (2.3 + 9.7) / 2 = 6.0 (net charge = 0)\n\nFor basic amino acid (e.g., lysine, 3 ionizable groups: α-COOH, α-NH₃⁺, ε-NH₃⁺):\n• pKa1 = 2.2 (α-COOH), pKa2 = 9.2 (α-NH₃⁺), pKa3 = 10.5 (ε-NH₃⁺)\n• Neutral form is flanked by pKa2 and pKa3: pI = (9.2 + 10.5) / 2 = 9.85 → pI > 7 (cationic at pH 7)\n\nFor acidic amino acid (e.g., aspartic acid, pKa1 = 2.0, pKa2 = 3.9, pKa3 = 9.9):\n• Neutral flanked by pKa1 and pKa2: pI = (2.0 + 3.9) / 2 = 2.95 → pI < 7 (anionic at pH 7)\n\nRule: pI = average of the two pKa values flanking the net-zero-charge species.',
        },
      ],
      mcqs: [
        {
          question: 'Histidine (His, H) has pKa values: α-COOH = 1.8, imidazolium R group = 6.0, α-NH₃⁺ = 9.3. At physiological pH 7.4, what is the charge on histidine?',
          options: [
            '+1 (fully protonated)',
            '~−0.3 (slightly negative — mostly neutral but marginally deprotonated at α-NH₃⁺)',
            'Mostly neutral/zwitterion — imidazole side chain (pKa 6.0) is almost fully deprotonated at pH 7.4; net charge ≈ −0.05 to −0.1',
            '+2 (both amino groups protonated)',
          ],
          correct: 2,
          explanation: 'At pH 7.4: (1) α-COOH (pKa 1.8): completely deprotonated → –COO⁻ (charge −1); (2) α-NH₃⁺ (pKa 9.3): pH 7.4 < 9.3 → still protonated (charge +1); (3) Imidazolium R (pKa 6.0): pH 7.4 >> pKa 6.0 → mostly deprotonated → uncharged (neutral imidazole). Using Henderson-Hasselbalch for imidazole: pH = pKa + log([base]/[acid]); 7.4 = 6.0 + log(ratio) → ratio = 10^1.4 ≈ 25 → ~96% deprotonated. Net charge ≈ (−1) + (+1) + (~0) = ~0. Histidine is the only amino acid with a side chain pKa near physiological pH, making it the dominant buffer in proteins and the key residue in enzyme active sites (serine proteases, hemoglobin Bohr effect).',
        },
        {
          question: 'Cysteine is classified as an L-amino acid but has the (R) configuration at its α-carbon (not the usual (S)). Why?',
          options: [
            'Cysteine is actually a D-amino acid — it was misclassified',
            'When applying CIP priority rules, the sulfur-containing –CH₂SH side chain has a higher priority than the –COOH group due to sulfur\'s higher atomic number (S = 16 > O = 8). This changes the priority order at the α-carbon, reversing the designation from (S) to (R) even though the 3D arrangement is the same as all other L-amino acids',
            'Cysteine has a different stereocenter than other amino acids',
            'The (R)/(S) system does not apply to amino acids — only to other chiral molecules',
          ],
          correct: 1,
          explanation: 'L-amino acids typically have (S) configuration because for most amino acids, CIP priorities are: –NH₂ > –COOH > –R (side chain) > –H. The (S) configuration gives an L-amino acid (counterclockwise arrangement when H points away). For cysteine, the side chain is –CH₂SH. When assigning priorities, S (atomic number 16) > O (atomic number 8) → –CH₂SH has HIGHER priority than –COOH (which starts with C then O). This changes priority order at α-C from the usual arrangement → the spatial arrangement looks "clockwise" instead of counterclockwise → (R) designation. The actual 3D structure is still L (left, same as other L-amino acids when drawn in Fischer convention) — only the CIP letter changed due to the priority swap. This is a classic exam trap.',
        },
        {
          question: 'At what pH would you run electrophoresis to separate a mixture of glycine (pI 6.0), lysine (pI 9.7), and aspartic acid (pI 2.8)?',
          options: [
            'pH 6.0 — all amino acids migrate equally',
            'pH 6.0: at this pH, glycine is neutral (at pI, no migration); lysine is positively charged (pI 9.7 >> 6.0 → net + charge → migrates toward cathode); aspartic acid is negatively charged (pI 2.8 << 6.0 → net − charge → migrates toward anode) — all three are separated',
            'pH 2.8 — all three are positively charged',
            'pH 9.7 — all three are negatively charged',
          ],
          correct: 1,
          explanation: 'Electrophoresis separates amino acids by charge at a given pH. At pH 6.0: (1) Glycine (pI 6.0): pH = pI → net charge = 0 → stays at origin; (2) Lysine (pI 9.7): pH 6.0 < 9.7 → solution more acidic than pI → extra protons available → lysine is protonated at its basic groups → net positive charge → migrates to cathode (negative electrode); (3) Aspartic acid (pI 2.8): pH 6.0 > 2.8 → solution more basic than pI → carboxylate groups deprotonated → net negative charge → migrates to anode (positive electrode). This perfectly separates all three into three bands. Running electrophoresis at a pH equaling one component\'s pI while the others carry opposite charges is the standard strategy for amino acid and protein separation.',
        },
      ],
      flashcards: [
        {
          front: 'Amino acid pI calculation',
          back: 'pI = average of the two pKa values flanking the neutral (net zero charge) species\n\nFor simple AA (e.g., Ala): pI = (pKa(COOH) + pKa(NH₃⁺)) / 2 ≈ (2.3 + 9.7) / 2 = 6.0\n\nFor basic AA (Lys, Arg, His): pI = average of pKa(α-NH₃⁺) and pKa(side chain NH₃⁺/guanidinium) → pI > 7\n\nFor acidic AA (Asp, Glu): pI = average of pKa(α-COOH) and pKa(side chain COOH) → pI < 7\n\nKey charge rule: pH < pI → net (+) charge; pH > pI → net (−) charge',
        },
        {
          front: 'The 20 standard amino acids: memory by category',
          back: 'Nonpolar aliphatic: Gly, Ala, Val, Leu, Ile, Pro (cyclic), Met (sulfur)\nAromatic: Phe, Tyr (–OH), Trp (indole)\nPolar uncharged: Ser, Thr (–OH), Cys (–SH), Asn, Gln (amide side chains)\nPositively charged (at pH 7): Lys (+1, ε-NH₃⁺), Arg (+1, guanidinium pKa 12.5), His (~0, imidazole pKa 6.0)\nNegatively charged (at pH 7): Asp (−1, β-COOH pKa 3.9), Glu (−1, γ-COOH pKa 4.1)\n\nEssential (cannot be synthesized): Val, Leu, Ile, Phe, Trp, Met, Thr, Lys, His (children also need Arg)',
        },
      ],
    },

    // ── Concept 2: Peptides, Protein Structure & Synthesis ───────────────────
    {
      id: 'ch22-c2-peptides',
      title: 'Peptides & Protein Structure',
      subtitle: 'Peptide bond geometry, primary through quaternary structure, and Edman degradation',
      estimatedMinutes: 13,
      accentHex: '#a855f7',
      blocks: [
        {
          type: 'text',
          body: 'Peptides are polymers of amino acids linked by amide (peptide) bonds between the α-carboxyl of one amino acid and the α-amino of the next. By convention, the N-terminus (free –NH₃⁺) is written at the left and the C-terminus (free –COO⁻) at the right. A polypeptide\'s sequence (primary structure) completely determines all higher levels of structure — this is the Anfinsen dogma.',
        },
        {
          type: 'callout',
          variant: 'key-fact',
          title: 'The Peptide Bond: Planar and Rigid',
          body: 'The peptide bond (C–N bond in –CO–NH–) is NOT a simple single bond. Resonance from the amide nitrogen donates its lone pair into the adjacent C=O:\n\nR–CO–NH–R\' ↔ R–C(O⁻)=N⁺H–R\' (partial double-bond character ~40%)\n\nConsequences:\n1. Planar: 6 atoms (Cα, C, O, N, H, Cα) lie in the same plane (ω = 0° or 180°)\n2. Rigid: restricted rotation around C–N bond (barrier ~75 kJ/mol)\n3. Trans preference: most peptide bonds are trans (E): the two α-carbons are on opposite sides of the C–N bond (reduces steric clash between side chains). Exception: Xaa–Pro bonds are ~30% cis (prolyl isomerization).\n4. Bond lengths: C–N bond is 1.33 Å (between C–N single 1.47 Å and C=N double 1.27 Å)\n\nThe planarity and trans preference enforce the allowed Ramachandran φ/ψ angles and thus drive secondary structure formation.',
        },
        {
          type: 'table',
          headers: ['Level', 'Description', 'Stabilized by', 'Key examples'],
          rows: [
            ['Primary (1°)', 'Sequence of amino acids (N→C)', 'Covalent peptide bonds', 'Insulin A/B chains, RNase A'],
            ['Secondary (2°)', 'Local backbone folding patterns', 'Backbone H-bonds (N–H···O=C)', 'α-Helix (3.6 res/turn, right-handed); β-sheet (parallel/antiparallel)'],
            ['Tertiary (3°)', 'Overall 3D fold of a single polypeptide', 'H-bonds, hydrophobic core, ionic interactions, disulfide bonds (Cys–S–S–Cys)', 'Myoglobin, lysozyme, chymotrypsin'],
            ['Quaternary (4°)', 'Assembly of multiple polypeptide chains', 'Same forces as tertiary; no covalent bonds except sometimes inter-chain disulfides', 'Hemoglobin (2α + 2β), antibodies, collagen triple helix'],
          ],
        },
        {
          type: 'callout',
          variant: 'analogy',
          title: 'α-Helix vs β-Sheet: Two Dominant Secondary Structures',
          body: 'α-Helix: backbone coils into a right-handed helix. 3.6 amino acid residues per turn; pitch 5.4 Å per turn; the C=O of residue i forms an H-bond with N–H of residue i+4. All C=O and N–H groups point roughly parallel to the helix axis (all involved in H-bonds → highly stable). Side chains project outward. Hydrophobic helices span membranes (7-TM helices in GPCRs).\n\nβ-Sheet: extended chains run side-by-side with H-bonds between adjacent strands. Can be parallel (both N→C) or antiparallel (alternating direction). Antiparallel β-sheet is more stable (H-bonds are more linear). Side chains alternately point above and below the sheet plane.',
        },
        {
          type: 'callout',
          variant: 'exam-tip',
          title: 'Edman Degradation: Sequencing from the N-terminus',
          body: 'Edman degradation identifies amino acids one at a time from the N-terminus:\n\n1. React peptide with phenyl isothiocyanate (PITC, Ph–N=C=S) at pH 8 → PITC attaches to α-amino group\n2. Treat with anhydrous acid (TFA): the PITC-labeled N-terminal residue cyclizes and cleaves off as a phenylthiohydantoin (PTH) derivative, leaving the rest of the peptide intact (one residue shorter)\n3. Identify the PTH-amino acid by HPLC or comparison with standards\n4. Repeat with the shortened peptide → read sequence one residue at a time\n\nLimitations: chemistry degrades after ~50–80 cycles (incomplete cleavage accumulates). For longer proteins: proteases (trypsin cuts after Lys/Arg; chymotrypsin after Phe/Trp/Tyr; CNBr cleaves after Met) generate fragments, then overlap sequencing identifies the full order. Today, mass spectrometry (LC-MS/MS) has largely replaced Edman for routine sequencing, but the chemistry is still exam-standard.',
        },
      ],
      mcqs: [
        {
          question: 'A tripeptide Ala–Gly–Lys is treated with Edman reagent (PITC) then acid. What happens?',
          options: [
            'Lys (the C-terminal residue) is removed and identified as PTH-Lys',
            'The entire peptide is hydrolyzed to free amino acids',
            'Ala (the N-terminal residue) is removed as PTH-Ala; the remaining dipeptide Gly–Lys remains intact for the next cycle',
            'Gly (the middle residue) is removed by the Edman reagent',
          ],
          correct: 2,
          explanation: 'Edman degradation specifically removes and identifies the N-terminal residue ONE AT A TIME while leaving the rest of the peptide intact. For Ala–Gly–Lys: (1) PITC reacts with the free α-NH₂ of Ala (the N-terminus); (2) Acid treatment: the PITC-Ala undergoes intramolecular cyclization at the newly protonated peptide nitrogen → the thiazolinone ring closes and the N-terminal Ala cleaves off as PTH-Ala. The key: the acid cleaves ONLY the first peptide bond (N-terminal to the next residue), not all peptide bonds. The remaining peptide (Gly–Lys) is intact with a new free N-terminus (Gly) ready for the next Edman cycle. Repeat: PTH-Gly is released, then PTH-Lys → sequence read as Ala, Gly, Lys.',
        },
        {
          question: 'The α-helix has 3.6 residues per turn. An H-bond forms between C=O of residue i and N–H of residue i+4. Why is Pro (proline) a "helix breaker"?',
          options: [
            'Proline\'s side chain is too large to fit inside the helix',
            'Proline has no N–H on its amide nitrogen (it is a secondary amine — N is part of the pyrrolidine ring). Therefore, proline CANNOT donate an H-bond to the C=O at position i-4. This breaks the i to i+4 H-bond pattern and disrupts the helix. Additionally, the pyrrolidine ring constrains the backbone φ angle, preventing the geometry required for the α-helical conformation',
            'Proline is too hydrophilic to be inside the helix interior',
            'Proline forms an unusual β-turn and therefore exits the helix',
          ],
          correct: 1,
          explanation: 'Proline (Pro, P) is the only standard amino acid where the α-amino group is part of a 5-membered pyrrolidine ring — this makes the N a SECONDARY amine (no N–H available). In an α-helix, the N–H of residue i+4 forms a hydrogen bond with the C=O of residue i. When a proline is at position i+4, there is NO N–H to donate this critical H-bond → the H-bond is missing → helix destabilized at this point. Additionally, the pyrrolidine ring fixes the ψ/φ angles of Pro in a narrow range incompatible with the α-helical ψ/φ values (helix: φ = −57°, ψ = −47°; Pro is forced toward φ ≈ −60° but ψ is constrained differently). Pro is commonly found at helix termini (N-cap or C-cap) or in turns between helices, where its rigidity is useful rather than disruptive.',
        },
        {
          question: 'Two Cys residues in a protein form a disulfide bond (Cys–S–S–Cys). What type of bond is this and what function does it serve?',
          options: [
            'A hydrogen bond that stabilizes secondary structure',
            'A covalent bond (oxidation of two –SH thiols to –S–S– disulfide): S–S bond is a covalent cross-link stabilizing tertiary (or quaternary) structure. Reduces the entropy of the unfolded state → thermodynamically stabilizes the folded protein',
            'An ionic bond between the sulfide anions',
            'A van der Waals interaction between the sulfur lone pairs',
          ],
          correct: 1,
          explanation: 'Disulfide bonds (S–S) are COVALENT bonds formed by oxidation of two cysteine thiol groups (–SH + –SH → –S–S– + 2H⁺ + 2e⁻; oxidized by O₂, glutathione disulfide, or H₂O₂). They are the only common covalent cross-link in protein tertiary structure (besides peptide bonds themselves). Function: (1) Thermodynamic stabilization — the S–S bond constrains the protein, reducing conformational entropy of the unfolded state by ~2 kcal/mol per disulfide; (2) Structural reinforcement — important for extracellular proteins that face harsh conditions (keratin, insulin, antibodies all have disulfides). Most intracellular proteins lack disulfides (reducing environment of cytoplasm keeps thiols free). Famous example: insulin A and B chains are held together by two interchain S–S bonds (and one intrachain S–S in the A chain).',
        },
      ],
      flashcards: [
        {
          front: 'Peptide bond: planar geometry and trans preference',
          back: 'Amide resonance → C–N bond has 40% double-bond character → restricted rotation\nAll 6 atoms (Cα–C=O–N–H–Cα) are COPLANAR (ω dihedral = 180° for trans, 0° for cis)\nTrans (E): most stable — two α-carbons on opposite sides of C–N bond → less steric clash\nCis (Z): only common in Xaa–Pro bonds (~30% cis); elsewhere <0.1%\n\nFree rotation allowed: φ (around N–Cα bond) and ψ (around Cα–C bond)\nAllowed φ/ψ: plotted on Ramachandran diagram → defined secondary structures\nα-Helix: φ ≈ −57°, ψ ≈ −47°\nβ-Sheet: φ ≈ −120°, ψ ≈ +120°',
        },
        {
          front: 'Edman degradation: N-terminal sequencing',
          back: 'Reagent: phenyl isothiocyanate (PITC, Ph–N=C=S) at pH 8\nReaction: PITC + N-terminal NH₂ → phenylthiocarbamoyl (PTC) derivative\nAcid step (TFA): cyclization → PTH-amino acid cleaved off; remaining peptide intact\nPTH-AA identified by HPLC comparison\nRepeat: read sequence residue by residue from N-terminus\n\nLimits: ~50–80 cycles; degradation from incomplete cleavage accumulates\nFor long proteins: cleave first with protease (trypsin after Lys/Arg; CNBr after Met), then sequence overlapping fragments\nModern: MS/MS has largely replaced Edman for routine proteomics',
        },
        {
          front: 'Four levels of protein structure',
          back: '1° Primary: amino acid sequence (N→C); covalent peptide bonds; determined by gene\n2° Secondary: local backbone H-bonds; α-helix (3.6 res/turn, i→i+4 H-bond); β-sheet (parallel/antiparallel)\n3° Tertiary: full 3D fold of one chain; H-bonds, hydrophobic effect, salt bridges, disulfides\n4° Quaternary: multiple chains; hemoglobin (2α2β), collagen (3 chains), antibody (2H+2L)\n\nForces stabilizing native structure:\nHydrophobic effect (strongest thermodynamic driving force) > H-bonds > van der Waals > ionic interactions > disulfide bonds (covalent, but few in number)',
        },
      ],
    },
  ],
}
