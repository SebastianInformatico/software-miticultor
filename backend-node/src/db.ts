import Loki from 'lokijs'
import fs from 'fs-extra'

const DB_FILE = 'miticultor_node.json'
export const db = new Loki(DB_FILE, { autosave: true, autosaveInterval: 2000 })

function ensureCollection<T extends object>(name: string) {
  let col = db.getCollection<T>(name)
  if (!col) col = db.addCollection<T>(name, { indices: ['id'] }) as any
  return col!
}

export const linea = ensureCollection<any>('linea')
export const semilla = ensureCollection<any>('semilla')
export const compra_semilla = ensureCollection<any>('compra_semilla')
export const linea_semilla_asignacion = ensureCollection<any>('linea_semilla_asignacion')
export const cosecha = ensureCollection<any>('cosecha')
export const venta = ensureCollection<any>('venta')
export const medida_crecimiento = ensureCollection<any>('medida_crecimiento')
export const comparativo_nota = ensureCollection<any>('comparativo_nota')

export async function loadDB() {
  if (await fs.pathExists(DB_FILE)) {
    await new Promise<void>((resolve, reject) => {
      db.loadDatabase({}, err => (err ? reject(err) : resolve()))
    })
  } else {
    db.saveDatabase()
  }
}
