import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
  name: "",
  price: "",
  cost: "",
  points: "",
  category: "",
  stock: "",
  image: ""
});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadProducts = useCallback(() => {
  try {
    const data = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(Array.isArray(data) ? data : []);
  } catch {
    setProducts([]);
  } finally {
    setLoading(false);
  }
}, []);
useEffect(() => {
  if (!localStorage.getItem("products")) {
    localStorage.setItem(
      "products",
      JSON.stringify([
        {
          id: 1,
          name: "Produit test",
          category: "Test",
          price: 10,
          cost: 5,
          points: 2,
          stock: 8,
        },
      ])
    );
  }
}, []);

useEffect(() => {
  loadProducts();
}, [loadProducts]);
  const onRefresh = loadProducts;

  const openAdd = () => {
    setEditingId(null);
setForm({
  name: "",
  price: "",
  cost: "",
  points: "",
  category: "",
  stock: "",
  image: "",
});
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price ?? ""),
      cost: String(p.cost ?? ""),
      points: String(p.points ?? ""),
      category: p.category ?? "",
      stock: String(p.stock ?? ""),
      image: p.image ?? "",
    });
    setDialogOpen(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const payload = {
  id: editingId || Date.now(),
  name: form.name.trim(),
  price: parseFloat(form.price) || 0,
  cost: parseFloat(form.cost) || 0,
  points: parseInt(form.points) || 0,
  category: form.category.trim() || "Autre",
  stock: parseInt(form.stock) || 0,
  image: form.image,
};

    const products = JSON.parse(localStorage.getItem("products") || "[]");

    let updatedProducts;

    if (editingId) {
      updatedProducts = products.map((p) =>
        p.id === editingId ? payload : p
      );

      toast({ title: "Produit mis à jour" });
    } else {
      updatedProducts = [...products, payload];

      toast({ title: "Produit ajouté" });
    }

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    loadProducts();
    setDialogOpen(false);

  } catch (err) {
    toast({
      title: "Erreur",
      description: err.message,
      variant: "destructive",
    });
  } finally {
    setSaving(false);
  }
};

const handleDelete = async (id) => {
  if (!confirm("Supprimer ce produit ?")) return;

  try {
    const products = JSON.parse(localStorage.getItem("products") || "[]");

    const updatedProducts = products.filter((p) => p.id !== id);

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    loadProducts();

    toast({
      title: "Produit supprimé",
    });
  } catch (err) {
    toast({
      title: "Erreur",
      description: err.message,
      variant: "destructive",
    });
  }
};

  const margin = (price, cost) => {
    if (!price) return 0;
    return (((price - cost) / price) * 100).toFixed(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
            <p className="text-sm text-muted-foreground">
              {products.length} produit{products.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
              <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Nom</th>
                <th className="px-4 py-3 font-semibold">Catégorie</th>
                <th className="px-4 py-3 font-semibold text-right">Prix de vente</th>
                <th className="px-4 py-3 font-semibold text-right">Coût</th>
                <th className="px-4 py-3 font-semibold text-right">Marge</th>
                <th className="px-4 py-3 font-semibold text-right">Points</th>
                <th className="px-4 py-3 font-semibold text-right">Stock</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                    Aucun produit. Cliquez sur « Ajouter » pour commencer.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
  {p.image ? (
    <img
      src={p.image}
      alt={p.name}
      className="w-14 h-14 object-cover rounded-lg border"
    />
  ) : (
    <div className="w-14 h-14 rounded-lg border bg-gray-100"></div>
  )}
</td>

<td className="px-4 py-3 font-medium">
  {p.name}
</td>
                    <td className="px-4 py-3">
                      {p.category && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-medium">
                          {p.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {(p.price ?? 0).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {(p.cost ?? 0).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-right">
<span
  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
    Number(margin(p.price, p.cost)) < 0
      ? "bg-red-100 text-red-600"
      : "bg-emerald-50 text-emerald-700"
  }`}
>
  {margin(p.price, p.cost)}%
</span>
</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {p.points ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={(p.stock ?? 0) <= 0 ? "text-destructive" : ""}>
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {products.length > 0 && (
              <tfoot>
                <tr className="bg-muted/40 font-semibold">
                  <td className="px-4 py-3">Total</td>
                  <td></td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {products.reduce((s, p) => s + (p.price ?? 0), 0).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {products.reduce((s, p) => s + (p.cost ?? 0), 0).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-right">—</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {products.reduce((s, p) => s + (p.points ?? 0), 0)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {products.reduce((s, p) => s + (p.stock ?? 0), 0)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Café latte"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Boissons"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Prix de vente (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Coût (€)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="points">Points rapportés</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Quantité en stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
  <Label htmlFor="image">Image du produit</Label>

  <Input
    id="image"
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        setForm({
          ...form,
          image: reader.result,
        });
      };

      reader.readAsDataURL(file);
    }}
  />

  {form.image && (
    <img
      src={form.image}
      alt="Aperçu"
      className="w-24 h-24 object-cover rounded-lg border"
    />
  )}
</div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement…" : editingId ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}