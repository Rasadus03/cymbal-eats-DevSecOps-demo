package com.cymbaleats.restaurants;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
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
import org.springframework.core.io.ClassPathResource;

@RestController
public class RestaurantsController {

  private static final Logger logger = Logger.getLogger("RestaurantsController");
  private static final String COLLECTION_NAME = "restaurants";
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
      System.out.println("Intializing the Restaurants controllers!!");
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


  @GetMapping("/restaurants-api/restaurants")
  public List<Map<String, Object>> getAllRestaurants()
      throws ExecutionException, InterruptedException, IOException {
    init();
    System.out.println("Loading all restaurants!!");
    ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
    List<QueryDocumentSnapshot> documents = future.get().getDocuments();

    List<Map<String, Object>> restaurants = new ArrayList<>();
    for (QueryDocumentSnapshot document : documents) {
      restaurants.add(document.getData());
    }

    return restaurants;
  }

  @GetMapping("/restaurants-api")
  public String ping() throws ExecutionException, InterruptedException, IOException {
    System.out.println("in Ping!!");

    return "A Ping!!!";
  }


  @GetMapping("/restaurants-api/addRestaurant") // Change to @PostMapping for a proper add operation
  public String addRestaurant() throws ExecutionException, InterruptedException, IOException {
    init();
    Map<String, Object> data = new HashMap<>();
    data.put("name", "New Restaurant");
    data.put("city", "Some City");
    data.put("rating", 4.5);

    ApiFuture<WriteResult> writeResult = db.collection(COLLECTION_NAME).document()
        .set(data); // Auto-generate ID
    // Or you can specify your own Document ID if needed:
    // ApiFuture<WriteResult> writeResult = db.collection(COLLECTION_NAME).document("your-custom-id").set(data);

    System.out.println("Update time : " + writeResult.get().getUpdateTime());
    return "Restaurant added";  // Return a more appropriate response (e.g., the created restaurant object)
  }


  @GetMapping("/restaurants-api/initRestaurants") // Change to @PostMapping for a proper add operation
  public String initRestaurants() throws ExecutionException, InterruptedException, IOException {
    init();
    System.out.println("Intializing the Restaurants!!@");
    ClassPathResource restaurantsJSON = new ClassPathResource("initial-restaurants.json");
    //File restaurantsJSON = ResourceUtils.getFile("../../../initial-restaurants.json");
    System.out.println(restaurantsJSON);
   // System.out.println(restaurantsJSON.getAbsolutePath());
    List<Map> initialRestaurants =
        (List<Map> )(new ObjectMapper().readValue(restaurantsJSON.getInputStream(), HashMap.class).get("mockRestaurants"));

    //System.out.println(((List)initialRestaurants.get("mockRestaurants")).get(0).getClass().getSimpleName());
    List<Map<String, Object>> currentRestaurants = getAllRestaurants();
    List restNames = new ArrayList<>(currentRestaurants.size());
    for(Map<String, Object> restaurant : currentRestaurants) {
       restNames.add(restaurant.get("name"));
    }
    for (Map restaurant : initialRestaurants) {
      if (!restNames.contains(restaurant.get("name"))) {
        System.out.println("cousine"+restaurant.get("cuisine"));
        Map<String, Object> document = new HashMap<>();
        document.put("id", restaurant.get("id"));
        document.put("name", restaurant.get("name"));
        document.put("cuisine", restaurant.get("cuisine"));
        document.put("description",restaurant.get("description"));
        document.put("image",restaurant.get("image"));
        ApiFuture<WriteResult> writeResult = db.collection(COLLECTION_NAME).document(restaurant.get("id")+"")
            .set(document);
        System.out.println("Update time : " + writeResult.get().getUpdateTime());
      }
    }

   // Auto-generate ID
    // Or you can specify your own Document ID if needed:
    // ApiFuture<WriteResult> writeResult = db.collection(COLLECTION_NAME).document("your-custom-id").set(data);


    return "Restaurant added";  // Return a more appropriate response (e.g., the created restaurant object)
  }

}