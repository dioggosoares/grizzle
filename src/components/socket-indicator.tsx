'use client'

import { useSocket } from '@/components/providers/socket-provider'
import { Badge } from '@/components/ui/badge'

export function SocketIndicator() {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="flex border-none bg-yellow-600 text-white"
      >
        Disconectado: Tentando reconectar a cada 1s
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="flex border-none bg-emerald-600 text-white"
    >
      Conectado: Atualizado em tempo real
    </Badge>
  )
}
