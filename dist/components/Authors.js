"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const api_1 = __importDefault(require("../api"));
const Layout_1 = __importDefault(require("./Layout"));
const AuthContext_1 = require("../contexts/AuthContext");
const Authors = () => {
    const { isAdmin } = (0, AuthContext_1.useAuth)();
    const [authors, setAuthors] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(0);
    const [totalPages, setTotalPages] = (0, react_1.useState)(0);
    const [newAuthor, setNewAuthor] = (0, react_1.useState)({ name: '', biography: '' });
    const [editingAuthor, setEditingAuthor] = (0, react_1.useState)(null);
    const [editData, setEditData] = (0, react_1.useState)({ name: '' });
    const [error, setError] = (0, react_1.useState)('');
    const limit = 5;
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        fetchAuthors();
    }, [currentPage]);
    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await api_1.default.get(`/api/authors?page=${currentPage + 1}&limit=${limit}`);
            if (response.data.authors) {
                setAuthors(response.data.authors);
                setTotalPages(response.data.totalPages || 0);
            }
            else {
                setAuthors(Array.isArray(response.data) ? response.data : []);
                setTotalPages(1);
            }
        }
        catch (err) {
            setError('Failed to fetch authors');
            setAuthors([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCreateAuthor = async (e) => {
        e.preventDefault();
        if (!newAuthor.name.trim() || !newAuthor.biography.trim())
            return;
        try {
            await api_1.default.post('/api/authors', {
                name_author: newAuthor.name.trim(),
                biography: newAuthor.biography.trim()
            });
            setNewAuthor({ name: '', biography: '' });
            fetchAuthors();
        }
        catch (err) {
            setError('Failed to create author');
        }
    };
    const handleEditAuthor = (author) => {
        setEditingAuthor(author.author_id);
        setEditData({ name: author.name_author });
    };
    const handleSaveEdit = async () => {
        if (!editData.name.trim() || !editingAuthor)
            return;
        try {
            await api_1.default.patch(`/api/authors/${editingAuthor}`, {
                name_author: editData.name.trim()
            });
            alert('Author updated successfully');
            setEditingAuthor(null);
            fetchAuthors();
        }
        catch (err) {
            setError('Failed to update author');
            alert('Failed to update author');
        }
    };
    const handleCancelEdit = () => {
        setEditingAuthor(null);
        setEditData({ name: '' });
    };
    const handleDeleteAuthor = async (authorId) => {
        if (!confirm('Are you sure you want to delete this author?'))
            return;
        try {
            await api_1.default.delete(`/api/authors/${authorId}`);
            alert('Author deleted successfully');
            fetchAuthors();
        }
        catch (err) {
            setError('Failed to delete author');
            alert('Failed to delete author');
        }
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)(Layout_1.default, { title: "Authors", children: (0, jsx_runtime_1.jsx)("div", { className: "loading", children: "Loading authors..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(Layout_1.default, { title: "Authors", children: [error && (0, jsx_runtime_1.jsx)("div", { className: "error-message", children: error }), isAdmin && ((0, jsx_runtime_1.jsxs)("section", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Add Author" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleCreateAuthor, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "author-name", children: "Name:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "author-name", value: newAuthor.name, onChange: (e) => setNewAuthor({ ...newAuthor, name: e.target.value }), required: true }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "author-biography", children: "Biography:" }), (0, jsx_runtime_1.jsx)("textarea", { id: "author-biography", value: newAuthor.biography, onChange: (e) => setNewAuthor({ ...newAuthor, biography: e.target.value }), required: true, rows: 3 }), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Add" })] })] })), (0, jsx_runtime_1.jsxs)("section", { className: "author-list", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Authors" }), (0, jsx_runtime_1.jsxs)("table", { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "ID" }), (0, jsx_runtime_1.jsx)("th", { children: "Name" }), (0, jsx_runtime_1.jsx)("th", { children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: authors.map(author => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: author.author_id }), (0, jsx_runtime_1.jsx)("td", { children: editingAuthor === author.author_id ? ((0, jsx_runtime_1.jsx)("input", { type: "text", value: editData.name, onChange: (e) => setEditData({ ...editData, name: e.target.value }) })) : (author.name_author) }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("div", { className: "action-buttons", children: editingAuthor === author.author_id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleSaveEdit, children: "Save" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleCancelEdit, children: "Cancel" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => navigate(`/authors/${author.author_id}`), children: "View" }), isAdmin && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleEditAuthor(author), children: "Edit" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleDeleteAuthor(author.author_id), children: "Delete" })] }))] })) }) })] }, author.author_id))) })] }), totalPages > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "pagination", children: Array.from({ length: totalPages }, (_, i) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handlePageChange(i), className: currentPage === i ? 'active' : '', children: i + 1 }, i))) }))] })] }));
};
exports.default = Authors;
