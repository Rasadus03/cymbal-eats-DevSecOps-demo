package com.cymbaleats.restaurant.details;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import java.awt.SystemColor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import  java.util.logging.Level;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.RequestParam;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import org.springframework.core.io.ClassPathResource;

@RestController
public class RestaurantDetailsController {

  private static final Logger logger = Logger.getLogger("RestaurantDetailsController");
  private static final String RESTAURANTS_COLLECTION_NAME = "restaurants";
  private static final String MENU_COLLECTION_NAME = "menu";
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
      System.out.println("Intializing the RestaurantDetails controllers!!");
      System.out.println("After FB options!");
      System.out.println("After FB init!");
      FirestoreOptions firestoreOptions = FirestoreOptions.newBuilder()
          .setProjectId("cloud-next25-screendemo")
          .setDatabaseId("cymbaleats")
          .setCredentials(credentials)
          .build();
      System.out.println("Before loading the firestore!!");
      db = firestoreOptions.getService();
      System.out.println("Finished Intializing the RestaurantDetails controllers!!");
    }
  }


  @GetMapping("/restaurant-details-api/restaurant-menu")
  public List<Map<String, Object>> getRestaurantMenu(@RequestParam(value="id")String restaurantId)
      throws ExecutionException, InterruptedException, IOException {
    init();
    List<Map<String, Object>> menu = new ArrayList<>();
    System.out.println("Loading all restaurant menu!! for :) "+restaurantId);
    Iterable<CollectionReference> collections  = db.collection(RESTAURANTS_COLLECTION_NAME).document(restaurantId).listCollections();
    System.out.println("document  " +collections.iterator().hasNext());
    for (CollectionReference collRef : collections) {
      System.out.println("id " +collRef.getId());
      if (collRef.getId().equals( MENU_COLLECTION_NAME)) {
        Iterable<DocumentReference> documents = collRef.listDocuments();
        System.out.println("Loading restaurant menu!!  "+documents);
        for (DocumentReference document : documents) {
          ApiFuture<DocumentSnapshot> future = document.get();
          menu.add(future.get().getData());
        }
      }
    }
    return menu;
  }

  @GetMapping("/restaurant-details-api")
  public String ping() throws ExecutionException, InterruptedException, IOException {
    System.out.println("in Ping!!");

    return "A Ping!!!";
  }


   @GetMapping("/restaurant-details-api/add-menu") // Change to @PostMapping for a proper add operation
  public String addRestaurant() throws ExecutionException, InterruptedException, IOException {
    init();
    Map<String, Object> data = new HashMap<>();
    data.put("name", "New Restaurant");
    data.put("city", "Some City");
    data.put("rating", 4.5);

    ApiFuture<WriteResult> writeResult = db.collection(RESTAURANTS_COLLECTION_NAME).document()
        .set(data); // Auto-generate ID
    // Or you can specify your own Document ID if needed:
    // ApiFuture<WriteResult> writeResult = db.collection(COLLECTION_NAME).document("your-custom-id").set(data);

    System.out.println("Update time : " + writeResult.get().getUpdateTime());
    return "Restaurant added";  // Return a more appropriate response (e.g., the created restaurant object)
  }


  @GetMapping("/restaurant-details-api/initRestaurantsMenu") // Change to @PostMapping for a proper add operation
  public String initRestaurants() throws ExecutionException, InterruptedException, IOException {
    init();
    System.out.println("Intializing the Restaurants Menus!!@");
    ClassPathResource restaurantsJSON = new ClassPathResource("initial-restaurants.json");
    //File restaurantsJSON = ResourceUtils.getFile("../../../initial-restaurants.json");
    System.out.println(restaurantsJSON);
    // System.out.println(restaurantsJSON.getAbsolutePath());
    List<Map> initialRestaurants =
        (List<Map> )(new ObjectMapper().readValue(restaurantsJSON.getInputStream(), HashMap.class).get("mockRestaurants"));

    //System.out.println(((List)initialRestaurants.get("mockRestaurants")).get(0).getClass().getSimpleName());

    for (Map restaurant : initialRestaurants) {
      System.out.println("restaurant id "+restaurant.get("id"));
      System.out.println("restaurant menu "+restaurant.get("menu"));
      List<Map<String, Object>> currentResturantMenu = getRestaurantMenu(restaurant.get("id")+"");
      List<Map<String, Object>> restaurantMenu = (List<Map<String, Object>>)restaurant.get("menu");
      if (currentResturantMenu.isEmpty()) {
        for (Map<String, Object> menu : restaurantMenu) {
          Map<String, Object> document = new HashMap<>();
          document.put("id", menu.get("id"));
          document.put("name", menu.get("name"));
          document.put("price", menu.get("price"));
          document.put("description",menu.get("description"));
          document.put("image",menu.get("image"));
          ApiFuture<WriteResult> writeResult = db.collection(RESTAURANTS_COLLECTION_NAME).document(restaurant.get("id")+"").collection(MENU_COLLECTION_NAME)
              .document(menu.get("id")+"")
              .set(document);
          System.out.println("Update time : " + writeResult.get().getUpdateTime());
        }
      }
    }

    // Auto-generate ID
    // Or you can specify your own Document ID if needed:
    // ApiFuture<WriteResult> writeResult = db.collection(COLLECTION_NAME).document("your-custom-id").set(data);


    return "Restaurants Menus added";  // Return a more appropriate response (e.g., the created restaurant object)
  }

}