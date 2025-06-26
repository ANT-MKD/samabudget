import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Users, Repeat } from "lucide-react"
import { useAppData } from "@/components/app-data-context"
import { useLanguage } from "@/components/language-system"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function Tontine({ onBack }: { onBack: () => void }) {
  const { tontines, addTontine, addTontineMember, updateTontineMemberAmount, payTontine, nextTontineTurn, deleteTontine, editTontineMember, deleteTontineMember, setTontineMemberUnpaid } = useAppData()
  const { t } = useLanguage()
  const [showCreate, setShowCreate] = useState(false)
  const [newTontine, setNewTontine] = useState({
    name: "",
    icon: "🤝",
    amount: "",
    cycle: "Mensuel",
  })
  const [memberName, setMemberName] = useState("")
  const [selectedTontine, setSelectedTontine] = useState<number | null>(null)
  const [newMember, setNewMember] = useState("")
  const [members, setMembers] = useState<{ name: string; hasPaid: boolean }[]>([])
  const [newAmount, setNewAmount] = useState("")
  const [newMemberAmount, setNewMemberAmount] = useState("")
  const [editAmounts, setEditAmounts] = useState<{ [name: string]: string }>({})
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [editMemberName, setEditMemberName] = useState("")
  const [editMemberAmount, setEditMemberAmount] = useState("")

  const tontineNameSuggestions = [
    "Tontine du quartier",
    "Tontine Tabaski",
    "Tontine femmes",
    "Tontine jeunes",
    "Tontine famille",
    "Tontine travail",
    "Tontine scolaire",
    "Tontine anniversaire",
    "Tontine voyage",
    "Tontine solidarité",
  ];
  const tontineCycleSuggestions = ["Mensuel", "Hebdomadaire", "Annuel"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:text-white">
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6 flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold flex items-center">🤝 {t("tontine.title")}</h1>
      </div>
      <div className="p-6 space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white dark:bg-slate-800">
          <CardContent className="p-6">
            <p className="text-gray-900 dark:text-white mb-2">{t("tontine.description")}</p>
            <Button onClick={() => setShowCreate(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> {t("tontine.create")}
            </Button>
          </CardContent>
        </Card>
        {showCreate && (
          <Card className="dark:bg-slate-800 dark:text-white">
            <CardHeader>
              <CardTitle>{t("tontine.create")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  addTontine({
                    name: newTontine.name,
                    icon: newTontine.icon,
                    amount: Number(newTontine.amount),
                    members: members,
                    turns: 0,
                    currentTurn: 0,
                    cycle: newTontine.cycle,
                  })
                  setShowCreate(false)
                  setNewTontine({ name: "", icon: "🤝", amount: "", cycle: "Mensuel" })
                  setMembers([])
                  setNewMember("")
                }}
                className="space-y-4"
              >
                <Input
                  placeholder={t("tontine.title")}
                  value={newTontine.name}
                  onChange={e => setNewTontine(v => ({ ...v, name: e.target.value }))}
                  required
                />
                <div className="flex flex-wrap gap-2 mb-2">
                  {tontineNameSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setNewTontine(v => ({ ...v, name: suggestion }))}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder={t("tontine.member_name")}
                    value={newMember}
                    onChange={e => setNewMember(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newMember.trim()) {
                        setMembers(m => [...m, { name: newMember.trim(), hasPaid: false }]);
                        setNewMember("");
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" /> {t("tontine.add_member")}
                  </Button>
                </div>
                {members.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {members.map((m, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-800">{m.name}</Badge>
                    ))}
                  </div>
                )}
                <Input
                  placeholder={t("tontine.amount") + " (" + t("tontine.next_turn") + ")"}
                  value={newTontine.amount}
                  onChange={e => setNewTontine(v => ({ ...v, amount: e.target.value }))}
                  type="number"
                  required
                />
                <Input
                  placeholder={t("tontine.cycle")}
                  value={newTontine.cycle}
                  onChange={e => setNewTontine(v => ({ ...v, cycle: e.target.value }))}
                />
                <div className="flex flex-wrap gap-2 mb-2">
                  {tontineCycleSuggestions.map((cycle) => (
                    <Button
                      key={cycle}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setNewTontine(v => ({ ...v, cycle }))}
                    >
                      {cycle}
                    </Button>
                  ))}
                </div>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                  <Plus className="w-4 h-4 mr-2" /> {t("tontine.create")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        <h2 className="text-lg font-semibold mb-2">{t("tontine.my_tontines")}</h2>
        <div className="space-y-4">
          {tontines.length === 0 && <p className="text-gray-500">Aucune tontine pour l'instant.</p>}
          {tontines.map((tontine: any) => {
            const handleExportPDF = () => {
              const doc = new jsPDF();
              doc.setFontSize(18);
              doc.text(`Tontine: ${tontine.name}`, 14, 16);
              doc.setFontSize(12);
              doc.text(`Cycle: ${tontine.cycle}`, 14, 26);
              doc.text(`Montant par défaut: ${tontine.amount} FCFA`, 14, 34);
              // Tableau des membres
              autoTable(doc, {
                startY: 40,
                head: [["Nom", "Montant (FCFA)"]],
                body: tontine.members.map((m: any) => [m.name, m.amount]),
                headStyles: { fillColor: [46, 204, 113], textColor: 255 },
                alternateRowStyles: { fillColor: [240, 255, 244] },
                styles: { fontSize: 11 },
              });
              // Historique des tours : un tableau par tour
              let y = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 60;
              tontine.history.forEach((h: any, idx: number) => {
                doc.setFontSize(13);
                doc.setTextColor(52, 73, 94);
                doc.text(`Tour ${h.turn} (${h.date})`, 14, y);
                y += 4;
                autoTable(doc, {
                  startY: y,
                  head: [["Membre", "Montant (FCFA)", "Payé"]],
                  body: h.amounts.map((a: any) => [
                    a.name,
                    a.amount,
                    a.paid ? "↑" : "↓"
                  ]),
                  headStyles: { fillColor: [52, 152, 219], textColor: 255 },
                  alternateRowStyles: { fillColor: [245, 250, 255] },
                  styles: { fontSize: 10 },
                  didParseCell: function (data: any) {
                    if (data.column.dataKey === 2) {
                      if (data.cell.raw === "↑") {
                        data.cell.styles.textColor = [39, 174, 96];
                      } else if (data.cell.raw === "↓") {
                        data.cell.styles.textColor = [231, 76, 60];
                      }
                    }
                  },
                });
                y = (doc as any).lastAutoTable.finalY + 10;
              });
              doc.save(`tontine-${tontine.name}.pdf`);
            };
            return (
              <Card key={tontine.id} className="hover:shadow-md transition-shadow dark:bg-slate-800 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{tontine.icon}</span>
                    <span>{tontine.name}</span>
                    <Badge className="bg-teal-100 text-teal-800 ml-2">{t("tontine.amount")}: {tontine.amount} FCFA</Badge>
                    <Badge className="bg-gray-100 text-gray-800 ml-2">{t("tontine.cycle")}: {tontine.cycle}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-center mb-2">
                    <Badge className="bg-blue-100 text-blue-800">{t("tontine.turns")}: {tontine.turns}</Badge>
                    <Badge className="bg-green-100 text-green-800">{t("tontine.next_turn")}: {tontine.currentTurn + 1}</Badge>
                    <Badge className="bg-purple-100 text-purple-800">{t("tontine.members")}: {tontine.members.length}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    <Users className="w-4 h-4 mr-1" />
                    {tontine.members.map((m: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 rounded px-2 py-1 mb-1">
                        {editingMember === m.name ? (
                          <>
                            <Input
                              value={editMemberName}
                              onChange={e => setEditMemberName(e.target.value)}
                              className="w-24"
                            />
                            <Input
                              type="number"
                              value={editMemberAmount}
                              onChange={e => setEditMemberAmount(e.target.value)}
                              className="w-24"
                            />
                            <Button size="sm" onClick={() => {
                              editTontineMember(tontine.id, m.name, editMemberName, Number(editMemberAmount));
                              setEditingMember(null);
                            }}>Valider</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingMember(null)}>Annuler</Button>
                          </>
                        ) : (
                          <>
                            <span>{m.name}</span>
                            <span className="text-xs text-gray-500">{m.amount} FCFA</span>
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingMember(m.name);
                              setEditMemberName(m.name);
                              setEditMemberAmount(m.amount.toString());
                            }}>Éditer</Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                              if (window.confirm(`Supprimer ${m.name} ?`)) deleteTontineMember(tontine.id, m.name);
                            }}>Supprimer</Button>
                            {m.hasPaid ? <span className="text-green-600 ml-2">✔️</span> : <span className="text-gray-400 ml-2">✗</span>}
                            <Button size="sm" variant="outline" style={{ color: '#27ae60', borderColor: '#27ae60' }} onClick={() => payTontine(tontine.id, m.name)}>
                              Payé
                            </Button>
                            <Button size="sm" variant="outline" style={{ color: '#e74c3c', borderColor: '#e74c3c' }} onClick={() => setTontineMemberUnpaid(tontine.id, m.name)}>
                              Non payé
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (newMember.trim()) {
                        addTontineMember(tontine.id, newMember.trim(), Number(newMemberAmount) || 0);
                        setNewMember("");
                        setNewMemberAmount("");
                      }
                    }}
                    className="flex gap-2 mb-2"
                  >
                    <Input
                      placeholder={t("tontine.member_name")}
                      value={newMember}
                      onChange={e => setNewMember(e.target.value)}
                    />
                    <Input
                      placeholder={t("tontine.amount")}
                      type="number"
                      value={newMemberAmount}
                      onChange={e => setNewMemberAmount(e.target.value)}
                      className="w-24"
                    />
                    <Button type="submit" variant="outline" className="bg-teal-50 text-teal-800">
                      <Plus className="w-4 h-4" /> {t("tontine.add_member")}
                    </Button>
                  </form>
                  <div className="flex gap-2 mb-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => nextTontineTurn(tontine.id)}>
                      <Repeat className="w-4 h-4 mr-1" /> {t("tontine.next_turn")}
                    </Button>
                    <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => payTontine(tontine.id, "Moi") /* à adapter pour l'utilisateur courant */}>
                      💸 {t("tontine.amount")}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteTontine(tontine.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> {t("tontine.delete")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleExportPDF}>
                      Exporter PDF
                    </Button>
                  </div>
                  {tontine.history && tontine.history.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Historique des tours</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-slate-700">
                              <th className="px-2 py-1">Tour</th>
                              <th className="px-2 py-1">Date</th>
                              <th className="px-2 py-1">Membre</th>
                              <th className="px-2 py-1">Montant</th>
                              <th className="px-2 py-1">Payé</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tontine.history.map((h: any) => (
                              h.amounts.map((a: any, j: number) => (
                                <tr key={h.turn + '-' + a.name}>
                                  {j === 0 && (
                                    <>
                                      <td className="px-2 py-1" rowSpan={h.amounts.length}>{h.turn}</td>
                                      <td className="px-2 py-1" rowSpan={h.amounts.length}>{h.date}</td>
                                    </>
                                  )}
                                  {j !== 0 && null}
                                  <td className="px-2 py-1">{a.name}</td>
                                  <td className="px-2 py-1">{a.amount} FCFA</td>
                                  <td className="px-2 py-1">
                                    <span style={{ color: a.paid ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                                      {a.paid ? '↑' : '↓'}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  )
} 