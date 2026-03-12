import { useMemo } from 'react'

export function toMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function fromMin(m) {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

export function useAgenda({ onlineBase, extra, nAtend, duracao, inicio, fim }) {
  return useMemo(() => {
    const totalOnline = onlineBase + extra
    const inicioMin   = toMin(inicio)
    const fimMin      = toMin(fim)

    // Slots: entra enquanto o INÍCIO <= horário de fim
    const slots = []
    let cur = inicioMin
    while (cur <= fimMin) {
      slots.push({ start: cur, end: cur + duracao })
      cur += duracao
    }

    const numSlots   = slots.length
    const capacidade = numSlots * nAtend
    const livres     = Math.max(0, capacidade - totalOnline)
    const faltam     = Math.max(0, totalOnline - capacidade)

    // Senhas
    const senhas = []
    for (let i = 1; i <= onlineBase; i++)    senhas.push({ n: i, tipo: 'online' })
    for (let i = onlineBase + 1; i <= totalOnline; i++) senhas.push({ n: i, tipo: 'extra' })

    // Distribui round-robin
    const atendentes = Array.from({ length: nAtend }, (_, i) => ({ idx: i + 1, senhas: [] }))
    senhas.forEach((s, i) => atendentes[i % nAtend].senhas.push(s))

    return { slots, numSlots, capacidade, livres, faltam, atendentes, totalOnline }
  }, [onlineBase, extra, nAtend, duracao, inicio, fim])
}
