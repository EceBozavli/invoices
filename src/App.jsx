import { useState, useEffect, useRef, Fragment } from "react";
import "./App.css";
import { data } from "../public/data";

function getSystemThemePref() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function App() {
  const [theme, setTheme] = useState(localStorage.theme || getSystemThemePref());
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [bills, setBills] = useState(data);
  const [isBillVisible, setIsBillVisible] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBill, setEditedBill] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const statusOptions = ["Draft", "Pending", "Paid"];
  const dialogRef = useRef(null);
  const dialogRefEdit = useRef(null);
  const dialogRefNew = useRef(null);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getFilteredBills = () => {
    if (selectedStatuses.length === 0) {
      return bills; 
    }
    return bills.filter((bill) => selectedStatuses.includes(bill.status)); 
  };

  const filteredBills = getFilteredBills(); 

  function handleThemeChange() {
    const changedTheme = theme === "light" ? "dark" : "light";
    setTheme(changedTheme);
  }

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleShowMore = (id) => {
    setSelectedBillId(id);
    setIsBillVisible(true);
    setIsEditMode(false);
  };

  const handleGoBack = () => {
    setIsBillVisible(false);
    setSelectedBillId(null);
    setIsEditMode(false);
  };

  const handleEdit = () => {
    const billToEdit = bills.find((bill) => bill.id === selectedBillId);
    if (billToEdit) {
      setEditedBill({ ...billToEdit });
      dialogRefEdit.current.showModal();
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditedBill(null);
  };

  const handleSaveChanges = () => {
    const updatedBills = bills.map((bill) =>
      bill.id === editedBill.id ? editedBill : bill
    );
    setBills(updatedBills);
    setIsEditMode(false);
    setEditedBill(null);
    setIsBillVisible(true);
  };

  const handleInputChange = (e, field, isItem = false, index = null) => {
    const value = e.target.value;

    if (isItem) {
      const updatedItems = editedBill.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setEditedBill((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      setEditedBill((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedBills = bills.filter((bill) => bill.id !== selectedBillId);
    setBills(updatedBills);
    setIsBillVisible(false);
    setSelectedBillId(null);
    setIsDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const selectedBill = bills.find((bill) => bill.id === selectedBillId);

  useEffect(() => {
    if (isDeleteModalOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isDeleteModalOpen]);

  function handleAddNewInvoice() {
    setIsNew(true);
    setIsBillVisible(false);
    setIsEditMode(false);
    setIsNewModalOpen(true);
    dialogRefNew.current?.showModal();
}
useEffect(() => {
  if (isNew) {
    dialogRefNew.current?.showModal();
  } else {
    dialogRefNew.current?.close();
  }
}, [isNew]);

  const handleSaveAndSend = () => {
    const newInvoice = {
      id: bills.length + 1,
      billFrom: {
        streetAddress: document.querySelector('.new-streetAdInp').value,
        city: document.querySelector('.new-city input').value,
        postCode: document.querySelector('.new-post-code input').value,
        country: document.querySelector('.new-bill-form input[placeholder="country"]').value,
      },
      billTo: {
        clientName: document.querySelector('.new-bill-to input[placeholder="Client’s Name"]').value,
        clientEmail: document.querySelector('.new-bill-to input[placeholder="Client’s Email"]').value,
        address: document.querySelector('.new-bill-to input[placeholder="Street Address"]').value,
        city: document.querySelector('.new-bill-to-city input').value,
        postCode: document.querySelector('.new-bill-to-post-code input').value,
        country: document.querySelector('.new-bill-to input[placeholder="Country"]').value,
      },
      invoiceDate: document.querySelector('.new-bill-to input[placeholder="Invoice Date"]').value,
      paymentTerms: document.querySelector('.new-bill-to input[placeholder="Payment Terms"]').value,
      description: document.querySelector('.new-bill-to input[placeholder="Project Description"]').value,
      items: [], 
      status: "Pending", 
    };

    setBills([...bills, newInvoice]);
    setIsNew(false);
  };

  function handleDiscard() {
    setIsNew(false);
  }

  function handleSad() {
    
  }

  function handleSs() {
    handleSaveAndSend();
  }

  return (
    <>
      <div className="container">
        <div className="header">
          <img src="./public/img/logo.svg" className="logo" />
          <div className="header-inner">
            <div
              className="input"
              onClick={handleThemeChange}
              style={{ cursor: "pointer" }}
            >
              <label>
                <input
                  type="checkbox"
                  onChange={handleThemeChange}
                  checked={theme === "dark"}
                  style={{ display: "none" }}
                />
              </label>
              {theme === "dark" ? (
                <img src="./public/img/circle.svg" alt="Dark Mode" className="mode" />
              ) : (
                <img src="./public/img/moon.svg" alt="Light Mode" className="mode"/>
              )}
            </div>
            <div className="avatar">
              <img src="./public/img/avatar.svg" alt="Avatar" />
            </div>
          </div>
        </div>
        {!isBillVisible && !isEditMode && !isNew && (
          <div className="hero">
            <div className="hero-header">
              <div className="text-part">
                <h3>Invoices</h3>
                <p>There are {filteredBills.length} pending invoices</p>
              </div>
              <div className="changing-part">
                <div className="filter">
                  <h3 onClick={toggleFilterVisibility} style={{ cursor: "pointer" }}>
                    Filter{isFilterVisible ? "▲" : "▼"}
                  </h3>
                  {isFilterVisible && (
                    <div
                      className="dropdown"
                      style={{
                        backgroundColor: theme === "dark" ? "#2B3844" : "#fff",
                        boxShadow:
                          theme === "dark"
                            ? "0px 10px 20px 0px #00000040"
                            : "0px 10px 20px 0px #48549F40",
                      }}
                    >
                      {statusOptions.map((status, index) => (
                        <label key={index} className="filter-option">
                          <input
                            type="checkbox"
                            value={status}
                            checked={selectedStatuses.includes(status)}
                            onChange={() => handleStatusChange(status)}
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <button className="new-btn" onClick={handleAddNewInvoice}>
                  <div className="btn-inner">
                    <img src="./public/img/plus.svg" alt="New" />
                    <p>New</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="show-more">
          {isEditMode && editedBill && !isNew ? (
            <>
           
            </>

          ) : isBillVisible && selectedBill && !isNew ? (
            <div className="show-more-inner">
              <ul>
                <li key={selectedBill.id}>
                  <button className="goBackBtn" onClick={handleGoBack}>
                    <img src="./public/img/left-arrow.svg" /> Go back
                  </button>
                  <div className="sm-inner">
                    <div className="show-more-header">
                      <p>Status</p>
                      <p
                        style={{
                          color:
                            selectedBill?.status === "Paid"
                              ? "#33D69F"
                              : selectedBill?.status === "Pending"
                                ? "#FF8F00"
                                : selectedBill?.status === "Draft"
                                  ? "#373B53"
                                  : "#000",
                          backgroundColor:
                            selectedBill?.status === "Paid"
                              ? "#b9fde6"
                              : selectedBill?.status === "Pending"
                                ? "#f6e0c4"
                                : selectedBill?.status === "Draft"
                                  ? "#cacee4"
                                  : "#000",
                          padding: "10px",
                          borderRadius: "6px",
                        }}
                      >
                        {selectedBill?.status || "Unknown Status"}
                      </p>
                    </div>
                    <div className="show-more-hero">
                      <div className="first">
                        <div className="f-1">
                          <h6>#{selectedBill.id}</h6>
                          <p>{selectedBill.description}</p>
                        </div>
                        <div className="f-2">
                          <p>{selectedBill.billFrom.streetAddress}</p>
                          <p>{selectedBill.billFrom.city}</p>
                          <p>{selectedBill.billFrom.postCode}</p>
                          <p>{selectedBill.billFrom.country}</p>
                        </div>
                      </div>
                      <div className="second">
                        <div className="second-first">
                          <div className="aa">
                            <div>
                              <p>Invoice Date</p>
                              <h6>{selectedBill.invoiceDate}</h6>
                            </div>
                            <div>
                              <p>Payment Due</p>
                              <h6>{selectedBill.paymentDue}</h6>
                            </div>
                          </div>
                        </div>
                        <div className="st">
                          <p>Sent to</p>
                          <h6>{selectedBill.billTo.clientEmail}</h6>
                        </div>
                        <div className="second-second">
                          <div className="s-1">
                            <p>Bill To</p>
                            <h6>{selectedBill.billTo.clientName}</h6>
                          </div>
                          <div className="s-2">
                            <p>{selectedBill.billTo.address}</p>
                            <p>{selectedBill.billTo.city}</p>
                            <p>{selectedBill.billTo.postCode}</p>
                            <p>{selectedBill.billTo.country}</p>
                          </div>
                        </div>
                      </div>
                      <div className="third">
                        {selectedBill.items.map((item, index) => (
                          <div key={index} className="third-first">
                            <div className="a">
                              <h6>{item.itemName}</h6>
                              <p>
                                {item.quantity} x £ {item.price}
                              </p>
                            </div>
                            <div className="b">
                              <h5>£ {item.quantity * item.price}</h5>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="last">
                        <p>Grand Total</p>
                        <h4>£ {selectedBill.grandTotal}</h4>
                      </div>
                    </div>
                    <div className="show-more-footer">
                      <button className="editBtn" onClick={handleEdit}>
                        Edit
                      </button>
                      <button className="deleteBtn" onClick={handleDelete}>
                        Delete
                      </button>
                      <button className="markBtn">Mark as Paid</button>
                    </div>

                  </div>
                </li>
              </ul>
            </div>
          ) : !isNew &&
          (
            <div className="invoices">
              {filteredBills.length > 0 ? (
                <div className="invoices-inner">
                  <ul>
                    {filteredBills.map((x) => (
                      <li key={x.id}>
                        <div className="billing">
                          <div className="invoinces-inner">
                            <div className="bill-inputs">
                              <h6>#{x.id}</h6>
                              <p>{x.invoiceDate}</p>
                              <h6>£ {x.grandTotal}</h6>
                            </div>
                            <div className="bill-condition">
                              <p className="condition">
                                {x.billTo?.clientName || "Unknown Client"}
                              </p>
                              <p
                                className="cnd"
                                style={{
                                  color:
                                    x?.status === "Paid"
                                      ? "#33D69F"
                                      : x?.status === "Pending"
                                        ? "#FF8F00"
                                        : x?.status === "Draft"
                                          ? "#373B53"
                                          : "#000",
                                  backgroundColor:
                                    x?.status === "Paid"
                                      ? "#b9fde6"
                                      : x?.status === "Pending"
                                        ? "#f6e0c4"
                                        : x?.status === "Draft"
                                          ? "#cacee4"
                                          : "#000",
                                }}
                              >
                                {x?.status || "Unknown Status"}
                              </p>
                              <button
                                className="showMmoreBtn"
                                onClick={() => handleShowMore(x.id)}
                              >
                                <img src="./public/img/right-arrow.svg" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <img src="./public/img/empty.svg" className="empty" />
                </>
              )}
            </div>
          )}
        </div>
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal">

              <dialog ref={dialogRef}>
                <form>
                  <h3>Confirm Deletion</h3>
                  <p>Are you sure you want to delete invoice. This action cannot be undone.</p>
                  <div className="modal-buttons">
                    <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                    <button className="confirm-btn" onClick={confirmDelete}>Delete</button>
                  </div>
                </form>
              </dialog>
            </div>
          </div>
        )}
        {isNew && !isBillVisible && (
          <div className="new-invoices">
            <dialog ref={dialogRefNew}>
              <form>
                <button className="goBackBtn" onClick={() => setIsNew(false)}>
                  <img src="./public/img/left-arrow.svg" /> Go back
                </button>
                <h2>New Invoice</h2>
                <div className="new-bill-form">
                  <h5>Bill From</h5>
                    <div>
                      <p>Street Address</p>
                      <input type="text" className="new-streetAdInp" placeholder="Street Address" />
                    </div>
                    <div className="nc">
                      <div className="new-cityInp">
                        <div className="new-city">
                          <p>City</p>
                          <input type="text" placeholder="City" />
                        </div>
                        <div className="new-post-code">
                          <p>Post Code</p>
                          <input type="text" placeholder="Post Code" />
                        </div>
                      </div>
                      <div className="ncc">
                        <p>Country</p>
                        <input type="text" placeholder="country" />
                      </div>
                    </div>
                </div>
                <div className="new-bill-to">
                  <h5>Bill To</h5>
                    <div>
                      <p>Client’s Name</p>
                      <input type="text" placeholder="Client’s Name" />
                    </div>
                    <div>
                      <p>Client’s Email</p>
                      <input type="text" placeholder="Client’s Email" />
                    </div>
                    <div>
                      <p>Street Address</p>
                      <input type="text" placeholder="Street Address" />
                    </div>
                    <div className="nccc">
                      <div className="new-bill-to-inputs">
                        <div className="new-bill-to-city">
                          <p>City</p>
                          <input type="text" placeholder="City" />
                        </div>
                        <div className="new-bill-to-post-code">
                          <p>Post Code</p>
                          <input type="text" placeholder="Post Code" />
                        </div>
                      </div>
                      <div className="ncccc">
                        <p>Country</p>
                        <input type="text" placeholder="Country" />
                      </div>
                    </div>
                    <div className="abc">
                      <div className="nid">
                        <p>Invoice Date</p>
                        <input type="text" placeholder="Invoice Date" />
                      </div>
                      <div className="npt">
                        <p>Payment Terms</p>
                        <input type="text" placeholder="Payment Terms" />
                      </div>
                    </div>
                    <div>
                      <p>Project Description</p>
                      <input type="text" placeholder="Project Description" />
                    </div>
                </div>
                <div className="new-item-list">
                  <h5>Item List</h5>
                  <div className="nil">
                    <div>
                      <p>Item Name</p>
                      <input type="text" placeholder="Item Name" />
                    </div>
                    <div className="new-item-amount">
                      <div className="new-qty">
                        <p>Qty.</p>
                        <input type="text" placeholder="Qty." />
                      </div>
                      <div className="new-price">
                        <p>Price</p>
                        <input type="text" placeholder="Qty." />
                      </div>
                      <div className="new-total">
                        <p>Total</p>
                        <input type="text" placeholder="Total" />
                      </div>
                    </div>
                  </div>  
                  <button className="addNewBtn">+ Add New Item</button>
                </div>
                <div className="new-edit-footer">
                  <button className="discardBtn" onClick={handleDiscard}>Discard</button>
                  <div>
                    <button className="sadBtn" onClick={handleSad}>Save as Draft</button>
                    <button className="ssBtn" onClick={handleSs}>Save & Send</button>
                  </div>
                </div>
              </form>
            </dialog>
          </div>
        )}
      </div>
      <div className="open-edit-dialog" > 
        <dialog ref={dialogRefEdit}>
          <form>
            <div className="edit-page">
              <button className="goBackBtn" onClick={handleCancel}>
                <img src="./public/img/left-arrow.svg" /> Go back
              </button>
              <h2>EDIT #{editedBill?.id}</h2>
              <div className="bill-form">
                <h5>Bill From</h5>
                <div className="sa">
                  <p>Street Address</p>
                  <input
                    type="text"
                    defaultValue={editedBill?.billFrom.streetAddress}
                    onChange={(e) => handleInputChange(e, "streetAddress")}
                    className="streetAdInp"
                  />
                </div>
                <div className="bb">
                  <div className="cityInp">
                    <div className="city">
                      <p>City</p>
                      <input
                        type="text"
                        defaultValue={editedBill?.billFrom.city}
                        onChange={(e) => handleInputChange(e, "city")}
                      />
                    </div>
                    <div className="post-code">
                      <p>Post Code</p>
                      <input
                        type="text"
                        defaultValue={editedBill?.billFrom.postCode}
                        onChange={(e) => handleInputChange(e, "postCode")}
                      />
                    </div>
                  </div>
                  <div className="c">
                    <p>Country</p>
                    <input
                      type="text"
                      defaultValue={editedBill?.billFrom.country}
                      onChange={(e) => handleInputChange(e, "country")}
                    />
                  </div>
                </div>
              </div>
              <div className="bill-to">
                <h5>Bill To</h5>
                <div>
                  <p>Client’s Name</p>
                  <input
                    type="text"
                    defaultValue={editedBill?.billTo.clientName}
                    onChange={(e) => handleInputChange(e, "clientName")}
                  />
                </div>
                <div>
                  <p>Client’s Email</p>
                  <input
                    type="text"
                    defaultValue={editedBill?.billTo.clientEmail}
                    onChange={(e) => handleInputChange(e, "clientEmail")}
                  />
                </div>
                <div>
                  <p>Street Address</p>
                  <input
                    type="text"
                    defaultValue={editedBill?.billTo.address}
                    onChange={(e) => handleInputChange(e, "address")}
                  />
                </div>
                <div className="bill-to-inputs">
                  <div className="cc">
                    <div className="bill-to-city">
                      <p>City</p>
                      <input
                        type="text"
                        defaultValue={editedBill?.billTo.city}
                        onChange={(e) => handleInputChange(e, "city")}
                      />
                    </div>
                    <div className="bill-to-post-code">
                      <p>Post Code</p>
                      <input
                        type="text"
                        defaultValue={editedBill?.billTo.postCode}
                        onChange={(e) => handleInputChange(e, "postCode")}
                      />
                    </div>
                    <div>
                    <p>Country</p>
                    <input
                      type="text"
                      defaultValue={editedBill?.billTo.country}
                      onChange={(e) => handleInputChange(e, "country")}
                    />
                  </div>
                  </div>
                  
                </div>
                <div className="dd">
                  <div>
                    <p>Invoice Date</p>
                    <input
                      type="date"
                      defaultValue={editedBill?.invoiceDate}
                      onChange={(e) => handleInputChange(e, "invoiceDate")}
                    />
                  </div>
                  <div>
                    <p>Payment Terms</p>
                    <input
                      type="text"
                      defaultValue={editedBill?.paymentTerms}
                      onChange={(e) => handleInputChange(e, "paymentTerms")}
                    />
                  </div>
                </div>
                <div>
                  <p>Project Description</p>
                  <input
                    type="text"
                    defaultValue={editedBill?.description}
                    onChange={(e) => handleInputChange(e, "description")}
                  />
                </div>
              </div>
              <div className="item-list">
                <h5>Item List</h5>
                {editedBill?.items.map((item, index) => (
                  <Fragment key={index}>
                    <div className="ee">
                      <div className="in">
                        <p>Item Name</p>
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => handleInputChange(e, "itemName", true, index)}
                        />
                      </div>
                      <div className="item-amount">
                        <div className="qty">
                          <p>Qty.</p>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleInputChange(e, "quantity", true, index)}
                          />
                        </div>
                        <div className="price">
                          <p>Price</p>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleInputChange(e, "price", true, index)}
                          />
                        </div>
                        <div className="total">
                          <p>Total</p>
                          <input
                            type="number"
                            value={item.total}
                            onChange={(e) => handleInputChange(e, "total", true, index)}
                          />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
                <button className="addNewBtn" onClick={handleAddNewInvoice}>+ Add New Item</button>
              </div>
              <div className="edit-footer">
                <button className="cancelBtn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="saveChangesBtn" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </dialog>
      </div> 
    </>
  );
}

export default App;