package com.cymbaleats.order.management;

import java.io.FilenameFilter;
import java.util.Date;
import java.util.List;

public class Order {
    private List<OrderItem> orderItems;
    private  User user;
    private Address shippingAddress;
    private String orderId;
    private Date estimatedDeliveryTime;
    private Date deliveryTime;
    private Status status;
    private float totalCost;
    public static enum Status {
      Submitted,
      Preparing,
      Prepared,
      ReadyForDelivery,
      OutForDelivery,
      Delivered
    }

  public float getTotalCost() {
    return totalCost;
  }

  public void setTotalCost(float totalCost) {
    this.totalCost = totalCost;
  }

  public Date getDeliveryTime() {
    return deliveryTime;
  }

  public void setDeliveryTime(Date deliveryTime) {
    this.deliveryTime = deliveryTime;
  }

  public List<OrderItem> getOrderItems() {
    return orderItems;
  }

  public void setOrderItems(List<OrderItem> orderItems) {
    this.orderItems = orderItems;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Address getShippingAddress() {
    return shippingAddress;
  }

  public void setShippingAddress(Address shippingAddress) {
    this.shippingAddress = shippingAddress;
  }

  public String getOrderId() {
    return orderId;
  }

  public void setOrderId(String orderId) {
    this.orderId = orderId;
  }

  public Date getEstimatedDeliveryTime() {
    return estimatedDeliveryTime;
  }

  public void setEstimatedDeliveryTime(Date estimatedDeliveryTime) {
    this.estimatedDeliveryTime = estimatedDeliveryTime;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }
}
