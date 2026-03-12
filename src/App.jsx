import { useState } from 'react'
import { SliderControl, TimeControl } from './Control'
import { useAgenda, fromMin } from './useAgenda'
import styles from './App.module.css'

const AT_COLORS = [
  { bg: '#0f2a1a', border: '#1a4a2a', accent: '#4ade80', text: '#86efac' },
  { bg: '#0f1e2e', border: '#1a3348', accent: '#60a5fa', text: '#93c5fd' },
  { bg: '#2a1a0f', border: '#4a2e1a', accent: '#fb923c', text: '#fdba74' },
  { bg: '#1e0f2a', border: '#3a1a4a', accent: '#c084fc', text: '#d8b4fe' },
  { bg: '#2a1a1a', border: '#4a2a2a', accent: '#f87171', text: '#fca5a5' },
  { bg: '#1a2a1a', border: '#2a4a2a', accent: '#34d399', text: '#6ee7b7' },
]

export default function App() {
  const [onlineBase, setOnlineBase] = useState(10)
  const [extra,      setExtra]      = useState(5)
  const [nAtend,     setNAtend]     = useState(2)
  const [duracao,    setDuracao]    = useState(50)
  const [inicio,     setInicio]     = useState('09:00')
  const [fim,        setFim]        = useState('15:30')

  const { slots, numSlots, capacidade, livres, faltam, atendentes, totalOnline } =
    useAgenda({ onlineBase, extra, nAtend, duracao, inicio, fim })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.tag}>Gestão de Atendimento</div>
          <h1 className={styles.title}>Calculadora<br />de Agenda</h1>
          <p className={styles.sub}>Configure os parâmetros e visualize a distribuição dos horários em tempo real.</p>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.dot} />
            Parâmetros
          </div>
          <div className={styles.controls}>
            <SliderControl label="Senhas online (base)" min={2} max={40} value={onlineBase} onChange={setOnlineBase} />
            <SliderControl label="Senhas extra online"  min={0} max={20} value={extra}      onChange={setExtra} />
            <SliderControl label="Atendentes"           min={1} max={6}  value={nAtend}     onChange={setNAtend} />
            <SliderControl label="Min. por atendimento" min={10} max={90} value={duracao}   onChange={setDuracao} display={`${duracao} min`} />
            <TimeControl   label="Início"  value={inicio} onChange={setInicio} />
            <TimeControl   label="Fim"     value={fim}    onChange={setFim} />
          </div>
        </section>

        <section className={styles.metrics}>
          {[
            { val: numSlots,    label: 'Slots / atendente' },
            { val: totalOnline, label: 'Senhas online' },
            { val: capacidade,  label: 'Capacidade total' },
            { val: livres,      label: 'Slots livres' },
          ].map(m => (
            <div key={m.label} className={styles.metric}>
              <span className={styles.metricVal}>{m.val}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </div>
          ))}
        </section>

        {faltam > 0 && (
          <div className={styles.warn}>
            ⚠ Faltam {faltam} slots para cobrir todas as senhas — reduza o tempo de atendimento ou aumente os atendentes.
          </div>
        )}

        <div className={styles.grid}>
          {atendentes.map((at, ai) => {
            const color = AT_COLORS[ai % AT_COLORS.length]
            return (
              <div key={at.idx} className={styles.atCard} style={{ '--at-bg': color.bg, '--at-border': color.border, '--at-accent': color.accent, '--at-text': color.text }}>
                <div className={styles.atHeader}>
                  <div className={styles.atTitle}>
                    <span className={styles.atDot} />
                    Atendente {at.idx}
                  </div>
                  <div className={styles.atMeta}>
                    <span>{numSlots} slots</span>
                    <span className={styles.sep}>·</span>
                    <span>{at.senhas.length} senhas</span>
                    <span className={styles.sep}>·</span>
                    <span>{numSlots - at.senhas.length} livres</span>
                  </div>
                </div>

                <div className={styles.slotList}>
                  {slots.map((slot, si) => {
                    const senha = at.senhas[si]
                    return (
                      <div key={si} className={`${styles.slot} ${!senha ? styles.slotLivre : ''}`}>
                        <span className={styles.slotTime}>{fromMin(slot.start)}</span>
                        {senha ? (
                          <>
                            <span className={styles.slotNum}>Senha {senha.n}</span>
                            <span className={`${styles.badge} ${senha.tipo === 'extra' ? styles.badgeExtra : styles.badgeOnline}`}>
                              {senha.tipo === 'extra' ? 'Extra' : 'Online'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className={styles.slotNumEmpty}>—</span>
                            <span className={`${styles.badge} ${styles.badgeLivre}`}>Livre</span>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <span>PROCON-ES</span>
        <span>·</span>
        <span>Calculadora de Agenda</span>
      </footer>
    </div>
  )
}
