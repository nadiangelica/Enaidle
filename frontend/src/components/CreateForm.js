import React from "react";
import { useState, useEffect } from "react";
import { useListingsContext } from "../hooks/useListingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

const CreateForm = (props) => {
  const { dispatch } = useListingsContext();
  const { user } = useAuthContext();

  // const id = localStorage.getItem('id');
  let id;
  if (user) {
    id = user.id;
  }

  const [orgName, setOrgName] = useState("");
  const [listingRequirement, setListingRequirement] = useState("all");
  const [isSubmitted, setShowSubmittedMessage] = useState(false);

  // get request to get the org user's organisation name
  useEffect(() => {
    getOrgName(id);
  }, []);

  const getOrgName = async (id) => {
    const response = await fetch(`/api/org-users/${id}`);
    const json = await response.json();
    if (response.ok) {
      setOrgName(json.organisationName);
    } else {
      dispatch({ type: "SET_ERROR", payload: json });
    }
  };

  const createListing = async (listing) => {
    const response = await fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`,
        'User-Id': user.id
      },
      body: JSON.stringify(listing),
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "CREATE_LISTING", payload: json });
    } else {
      dispatch({ type: "SET_ERROR", payload: json });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      title,
      organisationName,
      description,
      requirement,
      firstLine,
      city,
      postcode,
      neededByDate,
    } = e.target.elements;
    const listing = {
      title: title.value,
      description: description.value,
      organisationName: orgName,
      organisationId: id,
      requirement: requirement.value,
      address: {
        firstLine: firstLine.value,
        city: city.value,
        postcode: postcode.value,
      },
      neededByDate: neededByDate.value,
    };
    // props is passed in from ListingsFeed.js
    createListing(listing);
    setShowSubmittedMessage(true);
  };

  return (
    // <div>
    // <Form className="addCommentForm" onSubmit={handleSubmit}>
    //     <label htmlFor="title">Title</label>
    //     <input type="text" name="title" id="title" />
    //     <label htmlFor="description">Description</label>
    //     <input type="text" name="description" id="description" />
    //     <label htmlFor="requirement">Requirement</label>
    //     <select name="requirement" id="requirement">
    //     <option value="Volunteering">Volunteering</option>
    //     <option value="Donation of goods">Donation of goods</option>
    //     </select>
    //     <label htmlFor="firstLine">Address</label>
    //     <input type="text" name="firstLine" id="firstLine" />
    //     <label htmlFor="city">Town</label>
    //     <input type="text" name="city" id="city" />
    //     <label htmlFor="postcode">Postcode</label>
    //     <input type="text" name="postcode" id="postcode" />
    //     <label htmlFor="neededByDate">Needed By Date</label>
    //     <input type="date" name="neededByDate" id="neededByDate" />
    //     <button type="submit">{props.buttonTitle}</button>
    //     {isSubmitted && <div className="info">Listing Submitted!</div>}
    // </Form>
    // {isSubmitted && <div className="info">Comment Submitted! Please refresh the page.</div>}
    // </div>
    <>
      <div className="title">
        <h2>What do you need help with?</h2>
      </div>

      <div className="new-listing-container">
        <Form className="add-new-listing" onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Form.Group as={Col} md="8">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                id="title"
                type="text"
                placeholder="e.g. 2 volunteers needed"
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Date Needed By</Form.Label>
              <Form.Control
                name="neededByDate"
                id="neededByDate"
                type="Date"
                placeholder="28/02/2023"
                required
              />
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} md="8">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                id="description"
                type="text"
                placeholder="e.g. We are looking for..."
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Requirement</Form.Label>
              <Form.Select
                name="requirement"
                id="requirement"
                aria-label="Requirement"
                required
                onChange={(e) => setListingRequirement(e.target.value)}
              >
                <option defaultValue="">Select an option...</option>
                <option value="Volunteering">Volunteering</option>
                <option value="Donation of goods">Donation of goods</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} md="5">
              <Form.Label>First Line of Address</Form.Label>
              <Form.Control
                name="firstLine"
                id="firstLine"
                type="text"
                placeholder="First Line"
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                id="city"
                type="text"
                placeholder="City"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                name="postcode"
                id="postcode"
                type="text"
                placeholder="W1 5BX"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid postcode.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Button variant="custom" type="submit">
            Submit form
          </Button>
          <br></br>
      {isSubmitted && (
        <div className="info">New listing created! Please go back to feed to see your listing.</div>
      )}
        </Form>
      </div>
    </>
  );
};

export default CreateForm;
