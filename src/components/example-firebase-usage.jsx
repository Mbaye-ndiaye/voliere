import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { usePigeons, useCouples, useCages } from "../hooks/useFirebaseStore";
import { firebaseActions } from "../lib/firebase-store-wrapper";
export default function ExampleFirebaseUsage() {
    const { pigeons, loading, error, activePigeons } = usePigeons();
    const { couples } = useCouples();
    const { cages } = useCages();
    const [newPigeon, setNewPigeon] = useState({
        bague: "",
        sex: "M",
        race: "",
        birthDate: "",
    });
    const handleAddPigeon = async () => {
        try {
            await firebaseActions.addPigeon({
                ...newPigeon,
                status: "actif",
            });
            setNewPigeon({ bague: "", sex: "M", race: "", birthDate: "" });
            alert("Pigeon ajouté avec succès!");
        }
        catch (error) {
            alert("Erreur lors de l'ajout du pigeon");
            console.error(error);
        }
    };
    const handleDeletePigeon = async (id) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce pigeon?")) {
            try {
                await firebaseActions.deletePigeon(id);
                alert("Pigeon supprimé avec succès!");
            }
            catch (error) {
                alert("Erreur lors de la suppression du pigeon");
                console.error(error);
            }
        }
    };
    if (loading)
        return _jsx("div", { children: "Chargement..." });
    if (error)
        return _jsxs("div", { children: ["Erreur: ", error] });
    return (_jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Gestion des Pigeons - Firebase" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-blue-100 p-4 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-blue-800", children: "Total Pigeons" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: pigeons.length })] }), _jsxs("div", { className: "bg-green-100 p-4 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-green-800", children: "Actifs" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: activePigeons.length })] }), _jsxs("div", { className: "bg-purple-100 p-4 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-purple-800", children: "Couples" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: couples.length })] }), _jsxs("div", { className: "bg-orange-100 p-4 rounded-lg", children: [_jsx("h3", { className: "font-semibold text-orange-800", children: "Cages" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: cages.length })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Ajouter un nouveau pigeon" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("input", { type: "text", placeholder: "Num\u00E9ro de bague", value: newPigeon.bague, onChange: (e) => setNewPigeon({ ...newPigeon, bague: e.target.value }), className: "px-3 py-2 border rounded-md" }), _jsxs("select", { value: newPigeon.sex, onChange: (e) => setNewPigeon({ ...newPigeon, sex: e.target.value }), className: "px-3 py-2 border rounded-md", children: [_jsx("option", { value: "M", children: "M\u00E2le" }), _jsx("option", { value: "F", children: "Femelle" })] }), _jsx("input", { type: "text", placeholder: "Race", value: newPigeon.race, onChange: (e) => setNewPigeon({ ...newPigeon, race: e.target.value }), className: "px-3 py-2 border rounded-md" }), _jsx("input", { type: "date", value: newPigeon.birthDate, onChange: (e) => setNewPigeon({ ...newPigeon, birthDate: e.target.value }), className: "px-3 py-2 border rounded-md" })] }), _jsx("button", { onClick: handleAddPigeon, className: "mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600", children: "Ajouter le pigeon" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md", children: [_jsx("h2", { className: "text-xl font-semibold p-6 border-b", children: "Liste des pigeons" }), _jsxs("div", { className: "overflow-x-auto", children: [_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Bague" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Sexe" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Race" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date de naissance" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: pigeons.map((pigeon) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: pigeon.bague }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${pigeon.sex === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`, children: pigeon.sex === 'M' ? 'Mâle' : 'Femelle' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: pigeon.race }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: pigeon.birthDate }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${pigeon.status === 'actif' ? 'bg-green-100 text-green-800' :
                                                            pigeon.status === 'vendu' ? 'bg-yellow-100 text-yellow-800' :
                                                                pigeon.status === 'mort' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'}`, children: pigeon.status }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsx("button", { onClick: () => handleDeletePigeon(pigeon.id), className: "text-red-600 hover:text-red-900", children: "Supprimer" }) })] }, pigeon.id))) })] }), pigeons.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Aucun pigeon trouv\u00E9" }))] })] })] }));
}
