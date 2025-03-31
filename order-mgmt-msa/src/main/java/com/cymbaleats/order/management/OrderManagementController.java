package com.cymbaleats.order.management;

import com.cymbaleats.order.management.Order.Status;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Calendar;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import  java.util.logging.Level;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Date;
import com.google.cloud.Timestamp;

@RestController
public class OrderManagementController {

  private static final Logger logger = Logger.getLogger("ShoppingCartController");
  private static final String USER_COLLECTION_NAME = "users";
  private static final String ORDERS_COLLECTION_NAME = "orders";
  private static final String ORDER_ITEM_COLLECTION_NAME = "order-items";
  private static final String CONFIG_COLLECTION_NAME = "configurations";
  private static final String ORDER_MGMT_DOCUMENT_NAME = "cymbal-eats-order-mgmt";
  private static final String ORDER_NUMBER_CONFIG = "last-order-number";
  private Firestore db = null;
  private boolean initialize = false;
  private String projectId;
  private static Map<String, Method> orderItemsMethods = new HashMap<>();


  public void init() throws IOException {
    if (db != null || !initialize) {
      projectId = System.getenv("GOOGLE_CLOUD_PROJECT");
      if (projectId == null) {
        projectId = "cloud-next25-screendemo";
      }
      logger.log(Level.INFO, "logging project id , {0}",new Object[]{projectId});
      GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
      System.out.println("Intializing the Shopping Cart controllers!!");
      System.out.println("After FB options!");
      System.out.println("After FB init!");
      FirestoreOptions firestoreOptions = FirestoreOptions.newBuilder()
          .setProjectId("cloud-next25-screendemo")
          .setDatabaseId("cymbaleats")
          .setCredentials(credentials)
          .build();
      System.out.println("Before loading the firestore!!");
      db = firestoreOptions.getService();
      System.out.println("Finished Intializing the Restaurants controllers!!");
      Method[] methods = OrderItem.class.getMethods();
      for(Method method : methods){
        if(method.getName().startsWith("set")) orderItemsMethods.put(method.getName(), method);
      }
    }
  }

  @GetMapping("/order-mgmt-api/list-orders")
  public List<Order> getUserOrders(@RequestParam(value="user-id")String userId)
      throws ExecutionException, InterruptedException, IOException {
    init();
    List<Order> orders = new ArrayList<>();
    System.out.println("Loading all user orders!! for :) "+userId);
    // Iterable<CollectionReference> ordersCollections  = db.collection(USER_COLLECTION_NAME).document(userId).collection(Orders_COLLECTION_NAME).listAllCollections();
    Iterable<DocumentReference> ordersDocuments  = db.collection(USER_COLLECTION_NAME).document(userId).collection(
        ORDERS_COLLECTION_NAME).listDocuments();
    //for (CollectionReference orderCollection : ordersCollections) {
    for (DocumentReference orderDocument : ordersDocuments) {
      Order order = new Order();
      order.setOrderId(orderDocument.getId());
      ApiFuture<DocumentSnapshot> orderDocumentSnap = orderDocument.get();
      order.setStatus(Status.valueOf((String) orderDocumentSnap.get().get("status")));
      order.setDeliveryTime(((Timestamp) orderDocumentSnap.get().get("deliveryTime")).toDate());
      order.setEstimatedDeliveryTime(((Timestamp) orderDocumentSnap.get().get("estimatedDeliveryTime")).toDate());
      Address shippingAddress = new Address();
      shippingAddress.setCity((String)orderDocumentSnap.get().get("city"));
      shippingAddress.setStreet((String)orderDocumentSnap.get().get("street"));
      shippingAddress.setApartmentNumber((String)orderDocumentSnap.get().get("apartmentNumber"));
      shippingAddress.setBuildingNumber((String)orderDocumentSnap.get().get("buildingNumber"));
      shippingAddress.setZipCode((String)orderDocumentSnap.get().get("zipCode"));
      order.setShippingAddress(shippingAddress);
      order.setTotalCost((float) (double)orderDocumentSnap.get().getDouble("totalCost"));
      User user = new User();
      user.setUserId(userId);
      order.setUser(user);
      orders.add(order);
    }
    return orders;
  }

  @PostMapping("/order-mgmt-api/get-order-details")
  public List<Order> getUserOrders(@RequestBody Order order)
      throws ExecutionException, InterruptedException, IOException {
    init();
    List<Order> orders = new ArrayList<>();
    System.out.println("Loading all user orderdetails!! for :) "+order.getOrderId());
    DocumentReference orderDocument  = db.collection(USER_COLLECTION_NAME).document(order.getUser().getUserId()).collection(
        ORDERS_COLLECTION_NAME).document(order.getOrderId());
    //for (CollectionReference orderCollection : ordersCollections) {
    order.setOrderId(orderDocument.getId());
    ApiFuture<DocumentSnapshot> orderDocumentSnap = orderDocument.get();
    order.setStatus(Status.valueOf((String)orderDocumentSnap.get().get("status")));
    order.setDeliveryTime(((Timestamp)orderDocumentSnap.get().get("deliveryTime")).toDate());
    order.setEstimatedDeliveryTime(((Timestamp)orderDocumentSnap.get().get("estimatedDeliveryTime")).toDate());
    Address shippingAddress = new Address();
    shippingAddress.setCity((String)orderDocumentSnap.get().get("city"));
    shippingAddress.setStreet((String)orderDocumentSnap.get().get("street"));
    shippingAddress.setApartmentNumber((String)orderDocumentSnap.get().get("apartmentNumber"));
    shippingAddress.setBuildingNumber((String)orderDocumentSnap.get().get("buildingNumber"));
    shippingAddress.setZipCode((String)orderDocumentSnap.get().get("zipCode"));
    order.setShippingAddress(shippingAddress);
    order.setTotalCost((float) (double)orderDocumentSnap.get().getDouble("totalCost"));
      Iterable<CollectionReference> orderItemsCollection = orderDocument.listCollections();
      List<OrderItem> orderItems = new ArrayList<>();
      for (CollectionReference orderItemsCol : orderItemsCollection) {
        Iterable<DocumentReference> orderItemsDocuments = orderItemsCol.listDocuments();
        for (DocumentReference orderItemsDocument : orderItemsDocuments) {
          ApiFuture<DocumentSnapshot> future = orderItemsDocument.get();
              OrderItem orderItem = new OrderItem();
          Map<String, Object> data = ((Map) (future.get().getData()));
          for (Map.Entry<String, Object> entry : data.entrySet()) {
            try {
              System.out.println(entry.getKey() + ": " + entry.getValue());
              System.out.println(entry.getKey() + ": " + entry.getValue().getClass().getName());
              String methodName = "set"+ Character.toTitleCase(entry.getKey().charAt(0)) + entry.getKey().substring(1) ;
              Method method = orderItemsMethods.get(methodName);
              if (methodName.equals("setQuantity")) {
                method.invoke(orderItem, (int) (long) entry.getValue());
              }
              else {
                method.invoke(orderItem, entry.getValue());
              }
            } catch ( IllegalAccessException e) {
              throw new RuntimeException(e);
            } catch (InvocationTargetException e) {
              throw new RuntimeException(e);
            }
          }
          orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);
        orders.add(order);
      }
    return orders;
  }

  @GetMapping("/order-mgmt-api")
  public String ping() throws ExecutionException, InterruptedException, IOException {
    System.out.println("in Ping!!");

    return "A Ping!!!";
  }

  private long getOrderId() throws ExecutionException, InterruptedException {
    DocumentReference orderMgmtConfig  = db.collection(CONFIG_COLLECTION_NAME).document(
        ORDER_MGMT_DOCUMENT_NAME);
    long orderId = (long) orderMgmtConfig.get().get().get(ORDER_NUMBER_CONFIG) +1;
    orderMgmtConfig.update(ORDER_NUMBER_CONFIG,  orderId);
    return orderId;

  }
  @PostMapping("/order-mgmt-api/place-order") // Change to @PostMapping for a proper add operation
  public String placeAnOrder(@RequestBody Order order) throws ExecutionException, InterruptedException, IOException {
    init();
    long orderId = getOrderId();
    DocumentReference ordersDocument  = db.collection(USER_COLLECTION_NAME).document(order.getUser().getUserId()).collection(
        ORDERS_COLLECTION_NAME).document(orderId+"");
    Calendar eta = Calendar.getInstance();
    eta.setTime(new Date());
    eta.add(Calendar.HOUR_OF_DAY, 1);
      Map<String, Object> document = new HashMap<>();
      document.put("orderId", orderId);
      document.put("status", Status.Submitted);
      document.put("deliveryTime", eta.getTime());
    document.put("estimatedDeliveryTime", eta.getTime());
    document.put("city", order.getShippingAddress().getCity());
    document.put("street", order.getShippingAddress().getStreet());
    document.put("apartmentNumber", order.getShippingAddress().getApartmentNumber());
    document.put("buildingNumber", order.getShippingAddress().getBuildingNumber());
    document.put("zipCode", order.getShippingAddress().getZipCode());
    document.put("totalCost", order.getTotalCost());
    ordersDocument.set(document);
    for(OrderItem orderItem : order.getOrderItems()) {
      DocumentReference orderItemDocument  = db.collection(USER_COLLECTION_NAME).document(order.getUser().getUserId()).collection(
          ORDERS_COLLECTION_NAME).document(orderId+"").collection(ORDER_ITEM_COLLECTION_NAME).document(orderItem.getTimeAdded());
      document = new HashMap<>();
      document.put("restaurantName", orderItem.getRestaurantName());
      document.put("restaurantId", orderItem.getRestaurantId());
      document.put("itemId", orderItem.getItemId());
      document.put("itemName", orderItem.getItemName());
      document.put("itemPrice", orderItem.getItemPrice());
      document.put("itemDescription", orderItem.getItemDescription());
      document.put("itemImageUrl", orderItem.getItemImageUrl());
      document.put("quantity", orderItem.getQuantity());
      document.put("timeAdded", orderItem.getTimeAdded());
      orderItemDocument.set(document);
    }
    return "Order Placed";  // Return a more appropriate response (e.g., the created restaurant object)
  }

}