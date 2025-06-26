import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, HelpCircle, PlayCircle } from "lucide-react"
import { useState } from "react"

interface HelpPageProps {
  onBack: () => void
  onStartTutorial: () => void
}

export function HelpPage({ onBack, onStartTutorial }: HelpPageProps) {
  const [showFAQ, setShowFAQ] = useState(true)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#001f3f] to-[#2ECC71] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold flex items-center gap-2"><HelpCircle className="w-6 h-6" /> Aide & FAQ</h1>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" /> Guide rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Ajoutez une transaction avec le bouton <b>+</b> en bas à droite du dashboard.</li>
              <li>Filtrez et recherchez vos transactions avec la barre en haut du dashboard.</li>
              <li>Personnalisez votre expérience dans <b>Profil &gt; Personnalisation</b> (thème, avatar).</li>
              <li>Gérez vos catégories dans <b>Catégories</b> (ajout, édition, suppression).</li>
              <li>Consultez vos statistiques et comparez vos dépenses dans <b>Statistiques</b>.</li>
            </ul>
            <Button className="mt-4" onClick={onStartTutorial}>
              <PlayCircle className="w-5 h-5 mr-2" /> Relancer le tutoriel interactif
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" /> FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Comment ajouter une transaction ?</p>
              <p className="text-gray-700">Cliquez sur le bouton <b>+</b> en bas à droite du dashboard, remplissez le formulaire puis validez.</p>
            </div>
            <div>
              <p className="font-semibold">Comment changer de thème ou d'avatar ?</p>
              <p className="text-gray-700">Allez dans <b>Profil</b> puis <b>Personnalisation</b> pour choisir un thème de couleurs ou un avatar.</p>
            </div>
            <div>
              <p className="font-semibold">Comment supprimer une catégorie ?</p>
              <p className="text-gray-700">Dans <b>Catégories</b>, cliquez sur la corbeille à droite de la catégorie à supprimer. Les transactions associées seront marquées "Sans catégorie".</p>
            </div>
            <div>
              <p className="font-semibold">Comment voir mes statistiques ?</p>
              <p className="text-gray-700">Rendez-vous dans <b>Statistiques</b> pour visualiser vos dépenses, comparaisons et graphiques.</p>
            </div>
            <div>
              <p className="font-semibold">Comment relancer le tutoriel ?</p>
              <p className="text-gray-700">Cliquez sur <b>Relancer le tutoriel interactif</b> en haut de cette page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 