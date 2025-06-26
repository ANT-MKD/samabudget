"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Download, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"

interface OrangeMoneyTransaction {
  id: string
  type: "send" | "receive" | "payment" | "withdrawal"
  amount: number
  description: string
  recipient?: string
  date: string
  status: "completed" | "pending" | "failed"
}

interface OrangeMoneyIntegrationProps {
  onTransactionImport?: (transactions: OrangeMoneyTransaction[]) => void
}

export function OrangeMoneyIntegration({ onTransactionImport }: OrangeMoneyIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pin, setPin] = useState("")
  const [transactions, setTransactions] = useState<OrangeMoneyTransaction[]>([])
  const [isImporting, setIsImporting] = useState(false)

  // Données mockées Orange Money
  const mockTransactions: OrangeMoneyTransaction[] = [
    {
      id: "OM001",
      type: "payment",
      amount: 2500,
      description: "Paiement transport - Car rapide",
      date: "2025-01-25",
      status: "completed",
    },
    {
      id: "OM002",
      type: "send",
      amount: 8500,
      description: "Transfert famille",
      recipient: "Maman",
      date: "2025-01-24",
      status: "completed",
    },
    {
      id: "OM003",
      type: "receive",
      amount: 50000,
      description: "Réception salaire",
      date: "2025-01-24",
      status: "completed",
    },
    {
      id: "OM004",
      type: "payment",
      amount: 1500,
      description: "Achat crédit téléphone",
      date: "2025-01-23",
      status: "completed",
    },
    {
      id: "OM005",
      type: "withdrawal",
      amount: 15000,
      description: "Retrait distributeur",
      date: "2025-01-22",
      status: "completed",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("XOF", "FCFA")
  }

  const connectOrangeMoney = async () => {
    setIsConnecting(true)
    // Simuler la connexion
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setTransactions(mockTransactions)
    setIsConnecting(false)
  }

  const importTransactions = async () => {
    setIsImporting(true)
    // Simuler l'import
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onTransactionImport?.(transactions)
    setIsImporting(false)
  }

  const refreshTransactions = async () => {
    setIsImporting(true)
    // Simuler le refresh avec nouvelles transactions
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newTransaction: OrangeMoneyTransaction = {
      id: `OM${Date.now()}`,
      type: "payment",
      amount: Math.floor(Math.random() * 10000) + 1000,
      description: "Nouvelle transaction",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    }
    setTransactions([newTransaction, ...transactions])
    setIsImporting(false)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return "📤"
      case "receive":
        return "📥"
      case "payment":
        return "💳"
      case "withdrawal":
        return "🏧"
      default:
        return "💰"
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "send":
      case "payment":
      case "withdrawal":
        return "text-red-600"
      case "receive":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-orange-600" />
            <span>Connecter Orange Money</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Importez vos transactions Orange Money</h3>
            <p className="text-orange-700 text-sm">
              Connectez votre compte Orange Money pour importer automatiquement vos transactions et avoir une vue
              complète de vos finances.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-orange-800 mb-1 block">Numéro de téléphone</label>
              <Input
                type="tel"
                placeholder="77 123 45 67"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-orange-800 mb-1 block">Code PIN Orange Money</label>
              <Input
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="border-orange-200 focus:border-orange-400"
                maxLength={4}
              />
            </div>
          </div>

          <Button
            onClick={connectOrangeMoney}
            disabled={isConnecting || !phoneNumber || !pin}
            className="w-full bg-orange-600 hover:bg-orange-700 h-12"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 mr-2" />
                Se connecter à Orange Money
              </>
            )}
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Sécurité garantie</p>
                <p className="text-xs text-blue-700">
                  Vos données sont chiffrées et nous ne stockons jamais votre code PIN.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span>Orange Money connecté</span>
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">Connecté</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div>
            <p className="font-medium text-gray-900">Compte : {phoneNumber}</p>
            <p className="text-sm text-gray-600">{transactions.length} transactions trouvées</p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshTransactions} disabled={isImporting}>
            <RefreshCw className={`w-4 h-4 mr-1 ${isImporting ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {transaction.date} {transaction.recipient && `• ${transaction.recipient}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === "receive" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs mt-1">
                  {transaction.status === "completed" ? "Terminé" : "En cours"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={importTransactions}
            disabled={isImporting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Import en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Importer ({transactions.length})
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsConnected(false)
              setTransactions([])
              setPhoneNumber("")
              setPin("")
            }}
          >
            Déconnecter
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Import automatique</p>
              <p className="text-xs text-yellow-700">
                Les nouvelles transactions seront automatiquement synchronisées toutes les heures.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
