(ns conway.core)

(defn create-random-column
  [y-size]
  (into [] (repeatedly y-size #(rand-nth '(" " "#")))))

(defn create-random-grid
  [x-size y-size]
  (into [] (repeatedly x-size #(create-random-column y-size))))

(defn print-grid
  [grid]
  (print (reduce str (map (fn [column] (str (reduce str column) "\n")) grid))))

(defn get-neighbor-coords
  [grid x y]
  (let [x-max (- (count grid) 1)
        y-max (- (count (get grid 0)) 1)
        deltas [[0 1] [1 1] [1 0] [1 -1] [0 -1] [-1 -1] [-1 0] [-1 1]]]
    (map (fn [delta]
           (let [x-coord (+ x (get delta 0))
                 y-coord (+ y (get delta 1))]
             (conj (vector)
                   (cond
                     (< x-coord 0) x-max
                     (> x-coord x-max) 0
                     :else x-coord)
                   (cond
                     (< y-coord 0) y-max
                     (> y-coord y-max) 0
                     :else y-coord)))) deltas)))

(defn count-live-neighbors
  [grid x y]
  (let [neighbor-coords (get-neighbor-coords grid x y)
        neighbors (map (fn [coords]
                         (get-in grid coords)) neighbor-coords)]
    (count (filter #(= "#" %) neighbors))))

(defn next-generation
  [grid]
  (into [] (map-indexed (fn [x-idx column]
                          (into [] (map-indexed (fn [y-idx cell]
                                                  (let [live-neighbors (count-live-neighbors grid x-idx y-idx)]
                                                    (if (= "#" cell)
                                                      (cond
                                                        (< live-neighbors 2) " "
                                                        (> live-neighbors 3) " "
                                                        :else "#")
                                                      (cond
                                                        (= live-neighbors 3) "#"
                                                        :else " ")))) column))) grid)))

(defn game-of-life
  [x-size y-size]
  (let [grid (atom (create-random-grid x-size y-size))]
    (while true
      (print-grid @grid)
      (println "================================================================================")
      (Thread/sleep 500)
      (reset! grid (next-generation @grid)))))

(defn -main
  []
  (game-of-life 20 80))
