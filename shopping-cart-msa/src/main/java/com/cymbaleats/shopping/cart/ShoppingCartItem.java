package com.cymbaleats.shopping.cart;

import java.io.FilenameFilter;

public class ShoppingCartItem {
    private String restaurantName;
    private String restaurantId;
    private String itemId;
    private String itemName;
    private String itemDescription;
    private String itemPrice;
    private String itemImageUrl;
    private String userId;
    private int quantity;
    private String timeAdded;

  @Override
  public String toString() {
    final StringBuffer sb = new StringBuffer("ShoppingCartItem{");
    sb.append("restaurantName='").append(restaurantName).append('\'');
    sb.append(", restaurantId='").append(restaurantId).append('\'');
    sb.append(", itemId='").append(itemId).append('\'');
    sb.append(", itemName='").append(itemName).append('\'');
    sb.append(", itemDescription='").append(itemDescription).append('\'');
    sb.append(", itemPrice='").append(itemPrice).append('\'');
    sb.append(", itemImageUrl='").append(itemImageUrl).append('\'');
    sb.append(", userId='").append(userId).append('\'');
    sb.append(", quantity=").append(quantity);
    sb.append(", timeAdded='").append(timeAdded).append('\'');
    sb.append('}');
    return sb.toString();
  }

  public String getTimeAdded() {
    return timeAdded;
  }

  public void setTimeAdded(String timeAdded) {
    this.timeAdded = timeAdded;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public String getRestaurantId() {
    return restaurantId;
  }

  public void setRestaurantId(String restaurantId) {
    this.restaurantId = restaurantId;
  }

  public String getRestaurantName() {
    return restaurantName;
  }

  public void setRestaurantName(String restaurantName) {
    this.restaurantName = restaurantName;
  }

  public String getItemId() {
    return itemId;
  }

  public void setItemId(String itemId) {
    this.itemId = itemId;
  }

  public String getItemName() {
    return itemName;
  }

  public void setItemName(String itemName) {
    this.itemName = itemName;
  }

  public String getItemDescription() {
    return itemDescription;
  }

  public void setItemDescription(String itemDescription) {
    this.itemDescription = itemDescription;
  }

  public String getItemPrice() {
    return itemPrice;
  }

  public void setItemPrice(String itemPrice) {
    this.itemPrice = itemPrice;
  }

  public String getItemImageUrl() {
    return itemImageUrl;
  }

  public void setItemImageUrl(String itemImageUrl) {
    this.itemImageUrl = itemImageUrl;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }
}
