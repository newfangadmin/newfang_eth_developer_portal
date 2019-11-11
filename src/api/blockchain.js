import { JsonRpc } from 'eosjs'
import { createDfuseClient } from '@dfuse/client'

// EOSJS

const eosClient = new JsonRpc(process.env.VUE_APP_EOS_RPC_BASE_API)

export const getTableRows = async function(...args) {
  const response = await eosClient.get_table_rows(...args)
  return response
}

// DFUSE

export const dfuseClient = createDfuseClient({
  apiKey: process.env.VUE_APP_DFUSE_API_KEY,
  network: process.env.VUE_APP_DFUSE_NETWORK
})

export const streamTableRows = async function(...args) {
  const response = await dfuseClient.streamTableRows(...args)
  return response
}
