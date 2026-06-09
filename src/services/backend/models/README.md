# Place your trained Keras model here as:
#   plant_disease_model.h5
#
# The model must:
#   - Accept input shape (None, 224, 224, 3)  — float32, values in [0, 1]
#   - Output shape (None, 5)                  — softmax probabilities
#     Class order: 0=Healthy, 1=Early Blight, 2=Late Blight, 3=Leaf Spot, 4=Powdery Mildew
#
# Quick training reference (PlantVillage subset):
#   from tensorflow.keras.applications import MobileNetV2
#   base = MobileNetV2(input_shape=(224,224,3), include_top=False, weights='imagenet')
#   ...
#   model.save('models/plant_disease_model.h5')
