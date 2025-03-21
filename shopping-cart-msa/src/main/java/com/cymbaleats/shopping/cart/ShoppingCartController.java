package com.cymbaleats.shopping.cart;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.WriteResult;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
import org.apache.commons.collections4.IterableUtils;

@RestController
public class ShoppingCartController {

  private static final Logger logger = Logger.getLogger("ShoppingCartController");
  private static final String USER_COLLECTION_NAME = "users";
  private static final String CART_COLLECTION_NAME = "cart";
  private Firestore db = null;
  private boolean initialize = false;
  private String projectId;


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
    }
  }


  @GetMapping("/shopping-cart-api/view-shopping-cart")
  public List<Map<String, Object>> getUserShoppingCart(@RequestParam(value="user-id")String userId)
      throws ExecutionException, InterruptedException, IOException {
    init();
    List<Map<String, Object>> cart = new ArrayList<>();
    System.out.println("Loading all user cart!! for :) "+userId);
    Iterable<CollectionReference> collections  = db.collection(USER_COLLECTION_NAME).document(userId).listCollections();
    System.out.println("document  " +collections.iterator().hasNext());
    for (CollectionReference collRef : collections) {
      System.out.println("id " +collRef.getId());
      if (collRef.getId().equals( CART_COLLECTION_NAME)) {
        Iterable<DocumentReference> documents = collRef.listDocuments();
        System.out.println("Loading user cart!!  "+documents);
        for (DocumentReference document : documents) {
          ApiFuture<DocumentSnapshot> future = document.get();
          Map updatedData = ((Map)(future.get().getData()));
          updatedData.put("userId", userId);
          cart.add(updatedData);
        }
      }
    }
    return cart;
  }

  @GetMapping("/shopping-cart-api/get-cart-item-count")
  public long getCartItemCount(@RequestParam(value="user-id")String userId)
      throws ExecutionException, InterruptedException, IOException {
    init();
    CollectionReference collections  = db.collection(USER_COLLECTION_NAME).document(userId).collection(CART_COLLECTION_NAME);
        Iterable<DocumentReference> documents = collections.listDocuments();
        long count = IterableUtils.size(documents);
        System.out.println("Loading user cart!!  "+count);
    return count;
  }

  @GetMapping("/shopping-cart-api")
  public String ping() throws ExecutionException, InterruptedException, IOException {
    System.out.println("in Ping!!");

    return "A Ping!!!";
  }


  @PostMapping("/shopping-cart-api/add-shopping-cart-item") // Change to @PostMapping for a proper add operation
  public String addShoppingCartItem(@RequestBody ShoppingCartItem item) throws ExecutionException, InterruptedException, IOException {
    init();
    ApiFuture<QuerySnapshot> future = db.collection(USER_COLLECTION_NAME).document(item.getUserId()).collection(CART_COLLECTION_NAME).whereEqualTo("restaurantId", item.getRestaurantId()).whereEqualTo("itemId", item.getItemId()).get();
    // future.get() blocks on response
    List<QueryDocumentSnapshot> documents = future.get().getDocuments();
    if (documents.isEmpty()) {
      System.out.println("Adding shopping cart item, sent data" + item);
      DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yy-HH:mm:ss");
      Map<String, Object> document = new HashMap<>();
      String id = dateTimeFormatter.format(LocalDateTime.now());
      document.put("restaurantName", item.getRestaurantName());
      document.put("restaurantId", item.getRestaurantId());
      document.put("itemId", item.getItemId());
      document.put("itemName", item.getItemName());
      document.put("itemPrice", item.getItemPrice());
      document.put("itemDescription", item.getItemDescription());
      document.put("itemImageUrl", item.getItemImageUrl());
      document.put("quantity", item.getQuantity());
      document.put("timeAdded", id);
      ApiFuture<WriteResult> writeResult = db.collection(USER_COLLECTION_NAME)
          .document(item.getUserId()).collection(CART_COLLECTION_NAME)
          .document(id)
          .set(document);
      System.out.println("Update time : " + writeResult.get().getUpdateTime());
    }
    else{
      for (DocumentSnapshot document : documents) {
        document.getReference().update("quantity", (Integer.parseInt(document.getData().get("quantity")+"")+item.getQuantity())+"");
      }
    }
    return "Item added";  // Return a more appropriate response (e.g., the created restaurant object)
  }


  @PostMapping("/shopping-cart-api/update-shopping-cart-item-quantity") // Change to @PostMapping for a proper add operation
  public String updateShoppingCartItemQuantity(@RequestBody ShoppingCartItem item) throws ExecutionException, InterruptedException, IOException {
    init();
    System.out.println("Updating shopping cart item, sent data"+item);
    ApiFuture<WriteResult> writeResult = db.collection(USER_COLLECTION_NAME).document(item.getUserId()).collection(CART_COLLECTION_NAME)
        .document(item.getTimeAdded())
        .update("quantity", item.getQuantity());
    System.out.println("Update time : " + writeResult.get().getUpdateTime());
    return "Item added";  // Return a more appropriate response (e.g., the created restaurant object)
  }

  @PostMapping("/shopping-cart-api/remove-shopping-cart-item") // Change to @PostMapping for a proper add operation
  public String removeShoppingCartItem(@RequestBody ShoppingCartItem item) throws ExecutionException, InterruptedException, IOException {
    init();
    System.out.println("Deleting shopping cart item, sent data"+item);
    ApiFuture<WriteResult> writeResult = db.collection(USER_COLLECTION_NAME).document(item.getUserId()).collection(CART_COLLECTION_NAME)
        .document(item.getTimeAdded())
        .delete();
    System.out.println("Update time : " + writeResult.get().getUpdateTime());
    return "Item deleted";  // Return a more appropriate response (e.g., the created restaurant object)
  }

  @PostMapping("/shopping-cart-api/clear-shopping-cart") // Change to @PostMapping for a proper add operation
  public String clearShoppingCart(@RequestBody User user ) throws ExecutionException, InterruptedException, IOException {
    init();
    CollectionReference collection  = db.collection(USER_COLLECTION_NAME).document(user.getUserId()).collection(CART_COLLECTION_NAME);
    ApiFuture<QuerySnapshot> future = collection.get();
    List<QueryDocumentSnapshot> documents = future.get().getDocuments();
    System.out.println("document  " +documents.iterator().hasNext());
    for (QueryDocumentSnapshot document : documents) {
      document.getReference().delete();
    }
    return "Cart Cleared";  // Return a more appropriate response (e.g., the created restaurant object)
  }


}