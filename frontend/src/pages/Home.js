import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";

const Home = () => {
  // Sample food items
  const foodItems = [
    {
      id: 1,
      name: "Pizza",
      image: "https://via.placeholder.com/300x200", // Replace with actual image URL
      description: "Delicious cheesy pizza with toppings.",
    },
    {
      id: 2,
      name: "Burger",
      image: "https://via.placeholder.com/300x200",
      description: "Juicy burger with fresh ingredients.",
    },
    {
      id: 3,
      name: "Pasta",
      image: "https://via.placeholder.com/300x200",
      description: "Italian pasta with creamy sauce.",
    },
  ];

  return (
    <>

      {/* Hero Section */}
      <div className="text-center text-white bg-dark py-5">
        <Container>
          <h1>Delicious Food, Delivered to Your Doorstep</h1>
          <p className="lead">Order now and enjoy your favorite meals at home!</p>
          <Button variant="primary" size="lg">Order Now</Button>
        </Container>
      </div>

      {/* Featured Food Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Dishes</h2>
        <Row>
          {foodItems.map((item) => (
            <Col key={item.id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={item.image} alt={item.name} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Button variant="success">Add to Cart</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
