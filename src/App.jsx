import {useEffect, useState} from "react";
import './App.css'

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [currentUser, setCurrentUser] = useState(null);
    const isAdmin = currentUser?.role === "ADMIN";
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.text();

        if (response.ok) {
            localStorage.setItem("token", data);
            setIsLoggedIn(true);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setCurrentUser(null);
    }

    const [activeSection, setActiveSection] = useState("products");

    //statuses
    const [productStatuses, setProductStatuses] = useState([]);

    //roles
    const [roles, setRoles] = useState([]);

    //categories
    const [categoryErrors, setCategoryErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
    });
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [updateCategory, setUpdateCategory] = useState({
        name: "",
        description: ""
    });
    const handleEditCategory = (category) => {
        setEditCategoryId(category.id);

        setUpdateCategory({
            name: category.name,
            description: category.description
        })
    };
    const handleUpdateCategory = async (id, updateCategory) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateCategory),
        });

        if (response.ok) {
            await fetchCategories();
        }
    };
    const handleSaveCategory = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to update this category?"
        );

        if (!confirmed) return;

        await handleUpdateCategory(editCategoryId, updateCategory);

        setEditCategoryId(null);
    };
    const handleCreateCategory = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newCategory),
        });

        if (!response.ok) {
            const data = await response.json();
            setCategoryErrors(data);
            return;
        }
        setCategoryErrors({});

        if (response.ok) {
            await fetchCategories();
            setNewCategory({
                name: "",
                description: ""
            });
        }
    };
    const handleDeleteCategory = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            await fetchCategories();
        }
    };
    const fetchCategories = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/categories", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setCategories(data);
        }
    };

    //users
    const [userErrors, setUserErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        role: ""
    });
    const [editUserId, setEditUserId] = useState(null);
    const [updateUser, setUpdateUser] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        role: ""
    });
    const handleEditUser = (user) => {
        setEditUserId(user.id);

        setUpdateUser({
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role
        })
    };
    const handleUpdateUser = async (id, updateUser) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateUser),
        });

        if (response.ok) {
            await fetchUsers();
        }
    };
    const handleSaveUser = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to update this user?"
        );

        if (!confirmed) return;

        await handleUpdateUser(editUserId, updateUser);

        setEditUserId(null);
    };
    const handleCreateUser = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            const data = await response.json();
            setUserErrors(data);
            return;
        }
        setUserErrors({});

        if (response.ok) {
            await fetchUsers();
            setNewUser({
                name: "",
                surname: "",
                email: "",
                password: "",
                role: ""
            });
        }
    };
    const handleDeleteUser = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            await fetchUsers();
        }
    };
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setUsers(data.content);
        }
    };

    //products
    const [productErrors, setProductErrors] = useState({});
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
    });
    const [editProductId, setEditProductId] = useState(null);
    const [updateProduct, setUpdateProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "",
        categoryId: "",
    });
    const handleEditProduct = (product) => {
        setEditProductId(product.id);

        setUpdateProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            status: product.status,
            categoryId: product.categoryId
        })
    };
    const handleUpdateProduct = async (id, updateProduct) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateProduct),
        });

        if (response.ok) {
            await fetchProducts();
        }
    };
    const handleSaveProduct = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to update this product?"
        );

        if (!confirmed) return;

        await handleUpdateProduct(editProductId, updateProduct);

        setEditProductId(null);
    };
    const handleDeleteProduct = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            await fetchProducts();
        }
    };
    const handleCreateProduct = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
            const data = await response.json();
            setProductErrors(data);
            return;
        }
        setProductErrors({});

        if (response.ok) {
            await fetchProducts();
            setNewProduct({
                name: "",
                description: "",
                price: "",
                stock: "",
                status: "",
                categoryId: ""
            });
        }
    };
    const fetchProducts = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/products/findProductsByOrderByUpdatedAtDesc", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setProducts(data);
        }
    };

    const formatPrice = (price) => {
        if (price == null) {
            return "-";
        }
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
        }).format(price);
    };

    //current user
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/users/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data);
            } else {
                console.error("Failed to fetch current user:", response.status);
            }
        };

        fetchCurrentUser();
    }, [isLoggedIn]);


    //product
    useEffect(() => {
        if (!isLoggedIn || activeSection !== "products") return;

        const fetchProducts = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/products", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data.content); //for page response
            }
        };
        fetchProducts();
    }, [isLoggedIn, activeSection]);

    //category
    useEffect(() => {
        if (!isLoggedIn || activeSection !== "categories") return;

        const fetchCategories = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data); //for list response
            }
        };
        fetchCategories();
    }, [isLoggedIn, activeSection]);

    //user
    useEffect(() => {
        if (!isLoggedIn || activeSection !== "users") return;

        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Users:", data);
                setUsers(data.content); //for page response
            }
        };
        fetchUsers();
    }, [isLoggedIn, activeSection]);

    //statuses
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchStatuses = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/products/statuses",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setProductStatuses(data);
            }
        };

        fetchStatuses();
    }, [isLoggedIn]);

    //roles
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchRoles = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/roles/findAllRoles",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            }
        };
        fetchRoles();
    }, [isLoggedIn]);

    if (isLoggedIn) {
        return (
            <div className="dashboard">
                <header className="topbar">
                    <h1>Product Inventory</h1>
                    <button className="logout-button"
                            onClick={handleLogout}>Logout
                    </button>
                </header>

                <div className="dashboard-body">
                    <aside className="sidebar">
                        <h3>
                            {currentUser?.role === "ADMIN"
                                ? "Admin Dashboard"
                                : currentUser?.role === "USER"
                                    ? "User Dashboard"
                                    : "Dashboard"}
                        </h3>
                        <button className={activeSection === "products" ? "active" : ""}
                                onClick={() => setActiveSection("products")}>Products
                        </button>
                        <button className={activeSection === "categories" ? "active" : ""}
                                onClick={() => setActiveSection("categories")}>Categories
                        </button>

                        {currentUser?.role === "ADMIN" && (
                            <button
                                className={activeSection === "users" ? "active" : ""}
                                onClick={() => setActiveSection("users")}
                            >
                                Users
                            </button>
                        )}
                    </aside>

                    <main className="content">
                        {activeSection === "products" && (
                            <>
                                <h2>Products</h2>
                                {isAdmin && (
                                    <div className="create-card">
                                        <h3>Create Product</h3>
                                        <div className="create-form">
                                            <div className="form-grid">
                                                <div className="form-field">
                                                    <input
                                                        className={`form-input ${productErrors.name ? "input-error" : ""}`}
                                                        type="text"
                                                        placeholder="Product Name"
                                                        value={newProduct.name}
                                                        onChange={(e) =>
                                                            setNewProduct({
                                                                ...newProduct,
                                                                name: e.target.value
                                                            })
                                                        }
                                                    />
                                                    {productErrors.name && (
                                                        <span className="error-message">
                                                      {productErrors.name}
                                                    </span>
                                                    )}
                                                </div>
                                                <div className="form-field">
                                                    <input
                                                        className={`form-input ${productErrors.description ? "input-error" : ""}`}
                                                        type="text"
                                                        placeholder="Description"
                                                        value={newProduct.description}
                                                        onChange={(e) =>
                                                            setNewProduct({
                                                                ...newProduct,
                                                                description: e.target.value,
                                                            })}
                                                    />
                                                    {productErrors.description && (
                                                        <span className="error-message">
                                                      {productErrors.description}
                                                    </span>
                                                    )}
                                                </div>
                                                <div className="form-field">
                                                    <input
                                                        className={`form-input ${productErrors.price ? "input-error" : ""}`}
                                                        type="number"
                                                        placeholder="Price"
                                                        value={newProduct.price}
                                                        onChange={(e) =>
                                                            setNewProduct({
                                                                ...newProduct,
                                                                price: e.target.value,
                                                            })}
                                                    />
                                                    {productErrors.price && (
                                                        <span className="error-message">
                                                      {productErrors.price}
                                                    </span>
                                                    )}
                                                </div>
                                                <div className="form-field">
                                                    <input
                                                        className={`form-input ${productErrors.stock ? "input-error" : ""}`}
                                                        type="number"
                                                        placeholder="Stock"
                                                        value={newProduct.stock}
                                                        onChange={(e) =>
                                                            setNewProduct({
                                                                ...newProduct,
                                                                stock: e.target.value,
                                                            })}
                                                    />
                                                    {productErrors.stock && (
                                                        <span className="error-message">
                                                      {productErrors.stock}
                                                    </span>
                                                    )}
                                                </div>
                                                <select
                                                    className="form-input"
                                                    value={newProduct.categoryId}
                                                    onChange={(e) =>
                                                        setNewProduct({
                                                            ...newProduct,
                                                            categoryId: e.target.value === ""
                                                                ? ""
                                                                : Number(e.target.value)
                                                        })}
                                                >
                                                    <option value="">Select category</option>

                                                    {categories?.map((category) => (
                                                        <option key={category.id}
                                                                value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button className="create-button" onClick={handleCreateProduct}>Create
                                            </button>
                                        </div>

                                    </div>
                                )}
                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                            {isAdmin && (
                                                <th>Edit</th>
                                            )}
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Status</th>
                                            <th>Category</th>
                                            {isAdmin && (
                                                <th>&#x1F5D1;</th>)}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products?.map((product) => (
                                            <tr key={product.id}>
                                                {isAdmin && (
                                                    <td>{editProductId === product.id ? (
                                                        <>
                                                            <button onClick={handleSaveProduct}>
                                                                Save
                                                            </button>
                                                            <button onClick={() => setEditProductId(null)}>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleEditProduct(product)}>
                                                            &#x270E;
                                                        </button>
                                                    )} </td>
                                                )}
                                                <td>{product.id}</td>
                                                <td>{editProductId === product.id ? (
                                                    <input
                                                        value={updateProduct.name}
                                                        onChange={(e) =>
                                                            setUpdateProduct({
                                                                ...updateProduct,
                                                                name: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    product.name
                                                )}</td>
                                                <td>{editProductId === product.id ? (
                                                    <input
                                                        value={updateProduct.description}
                                                        onChange={(e) =>
                                                            setUpdateProduct({
                                                                ...updateProduct,
                                                                description: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    product.description
                                                )}</td>
                                                <td>{editProductId === product.id ? (
                                                    <input
                                                        value={updateProduct.price}
                                                        onChange={(e) =>
                                                            setUpdateProduct({
                                                                ...updateProduct,
                                                                price: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    formatPrice(product.price)
                                                )}</td>
                                                <td>{editProductId === product.id ? (
                                                    <input
                                                        value={updateProduct.stock}
                                                        onChange={(e) =>
                                                            setUpdateProduct({
                                                                ...updateProduct,
                                                                stock: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    product.stock
                                                )}</td>
                                                <td>
                                                    {editProductId === product.id ? (
                                                        <select
                                                            className="form-input"
                                                            value={updateProduct.status}
                                                            onChange={(e) =>
                                                                setUpdateProduct({
                                                                    ...updateProduct,
                                                                    status: e.target.value
                                                                })
                                                            }
                                                        >
                                                            {productStatuses.map((status) => (
                                                                <option key={status} value={status}>
                                                                    {status}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        product.status ?? "-"
                                                    )}
                                                </td>
                                                <td>
                                                    {editProductId === product.id ? (
                                                        <select
                                                            className="form-input"
                                                            value={updateProduct.categoryId}
                                                            onChange={(e) =>
                                                                setUpdateProduct({
                                                                    ...updateProduct,
                                                                    categoryId: Number(e.target.value)
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select category</option>

                                                            {categories.map((category) => (
                                                                <option key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        categories.find((category) => category.id === product.categoryId)?.name ?? "-"
                                                    )}
                                                </td>
                                                {isAdmin && (
                                                    <td>
                                                        <button onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this product?")) {
                                                                handleDeleteProduct(product.id);
                                                            }
                                                        }}>Delete
                                                        </button>
                                                    </td>)}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        {activeSection === "categories" && (
                            <>
                                <h2>Categories</h2>
                                {
                                    isAdmin && (
                                        <div className="create-card">
                                            <h3>Create Category</h3>
                                            <div className="create-form">
                                                <div className="form-grid">
                                                    <div className="form-field">
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            placeholder="Name"
                                                            value={newCategory.name}
                                                            onChange={(e) =>
                                                                setNewCategory({
                                                                    ...newCategory,
                                                                    name: e.target.value,
                                                                })}
                                                        />
                                                        {categoryErrors.name && (
                                                            <span className="error-message">
                                                      {categoryErrors.name}
                                                    </span>
                                                        )}
                                                    </div>
                                                    <div className="form-field">
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            placeholder="Description"
                                                            value={newCategory.description}
                                                            onChange={(e) =>
                                                                setNewCategory({
                                                                    ...newCategory,
                                                                    description: e.target.value,
                                                                })}
                                                        />
                                                        {categoryErrors.description && (
                                                            <span className="error-message">
                                                      {categoryErrors.description}
                                                    </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button className="create-button" onClick={handleCreateCategory}>Create
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                            {isAdmin && (
                                                <th>Edit</th>
                                            )}
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            {isAdmin && (
                                                <th>&#x1F5D1;</th>
                                            )}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {categories?.map((category) => (
                                            <tr key={category.id}>
                                                {
                                                    isAdmin && (
                                                        <td>{editCategoryId === category.id ? (
                                                            <>
                                                                <button onClick={handleSaveCategory}>
                                                                    Save
                                                                </button>
                                                                <button onClick={() => setEditCategoryId(null)}>
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => handleEditCategory(category)}>
                                                                &#x270E;
                                                            </button>
                                                        )} </td>
                                                    )}
                                                <td>{category.id}</td>
                                                <td>{editCategoryId === category.id ? (
                                                    <input
                                                        className="form-input"
                                                        value={updateCategory.name}
                                                        onChange={(e) =>
                                                            setUpdateCategory({
                                                                ...updateCategory,
                                                                name: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    category.name
                                                )}</td>
                                                <td>{editCategoryId === category.id ? (
                                                    <input
                                                        className="form-input"
                                                        value={updateCategory.description}
                                                        onChange={(e) =>
                                                            setUpdateCategory({
                                                                ...updateCategory,
                                                                description: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    category.description
                                                )}</td>
                                                {isAdmin && (
                                                    <td>
                                                        <button onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this category?")) {
                                                                handleDeleteCategory(category.id);
                                                            }
                                                        }}>Delete
                                                        </button>
                                                    </td>)}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>

                        )}
                        {activeSection === "users" && (
                            <>
                                <h2>Users</h2>

                                {isAdmin && (
                                    <div className="create-card">
                                        <h3>Create User</h3>

                                        <div className="create-form">
                                            <div className="form-grid">
                                                <div className="form-field">
                                                    <input
                                                        type="text"
                                                        placeholder="Name"
                                                        value={newUser.name}
                                                        onChange={(e) =>
                                                            setNewUser({
                                                                ...newUser,
                                                                name: e.target.value,
                                                            })}
                                                    />
                                                    {userErrors.name && (
                                                        <span className="error-message">
                                                      {userErrors.name}
                                                    </span>
                                                    )}
                                                </div>
                                                <div className="form-field">
                                                    <input
                                                        type="text"
                                                        placeholder="Surname"
                                                        value={newUser.surname}
                                                        onChange={(e) =>
                                                            setNewUser({
                                                                ...newUser,
                                                                surname: e.target.value,
                                                            })}
                                                    />
                                                    {userErrors.surname && (
                                                        <span className="error-message">
                                                      {userErrors.surname}
                                                    </span>
                                                    )}
                                                </div>
                                                <div className="form-field">
                                                    <input
                                                        type="text"
                                                        placeholder="Email"
                                                        value={newUser.email}
                                                        onChange={(e) =>
                                                            setNewUser({
                                                                ...newUser,
                                                                email: e.target.value,
                                                            })}
                                                    />
                                                    {userErrors.email && (
                                                        <span className="error-message">
                                                      {userErrors.email}
                                                    </span>
                                                    )}
                                                </div>
                                                <div className="form-field">
                                                    <input
                                                        type="text"
                                                        placeholder="Password"
                                                        value={newUser.password}
                                                        onChange={(e) =>
                                                            setNewUser({
                                                                ...newUser,
                                                                password: e.target.value,
                                                            })}
                                                    />
                                                    {userErrors.password && (
                                                        <span className="error-message">
                                                      {userErrors.password}
                                                    </span>
                                                    )}
                                                </div>
                                                <div className="form-field">
                                                    <select
                                                        className="form-input"
                                                        value={newUser.role}
                                                        onChange={(e) =>
                                                            setNewUser({
                                                                ...newUser,
                                                                role: e.target.value
                                                            })}
                                                    >
                                                        <option value="">Select Role</option>

                                                        {roles.map((role) => (
                                                            <option key={role.id} value={role.name}>
                                                                {role.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {userErrors.role && (
                                                        <span className="error-message">
                                                      {userErrors.role}
                                                    </span>
                                                    )}
                                                </div>

                                            </div>

                                            <button className="create-button" onClick={handleCreateUser}>Create</button>
                                        </div>
                                    </div>
                                )}

                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                            {isAdmin && (
                                                <th>Edit</th>
                                            )}
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Surname</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>&#x1F5D1;</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users?.map((user) => (
                                            <tr key={user.id}>
                                                {isAdmin && (
                                                    <td>{editUserId === user.id ? (
                                                        <>
                                                            <button onClick={handleSaveUser}>
                                                                Save
                                                            </button>
                                                            <button onClick={() => setEditUserId(null)}>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleEditUser(user)}>
                                                            &#x270E;
                                                        </button>
                                                    )} </td>
                                                )}
                                                <td>{user.id}</td>
                                                <td>{editUserId === user.id ? (
                                                    <input
                                                        value={updateUser.name}
                                                        onChange={(e) =>
                                                            setUpdateUser({
                                                                ...updateUser,
                                                                name: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    user.name
                                                )}</td>
                                                <td>{editUserId === user.id ? (
                                                    <input
                                                        value={updateUser.surname}
                                                        onChange={(e) =>
                                                            setUpdateUser({
                                                                ...updateUser,
                                                                surname: e.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    user.surname
                                                )}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    <button onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this user?")) {
                                                            handleDeleteUser(user.id);
                                                        }
                                                    }}>Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </main>
                </div>

            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">

                <h1 className="login-title">Product Inventory</h1>
                <p className="login-subtitle">
                    Inventory Management System
                </p>

                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="login-field">
                        <label>Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login-field">
                        <label>Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="login-button" type="submit">
                        Login
                    </button>

                </form>
            </div>
        </div>
    );
}

export default App
