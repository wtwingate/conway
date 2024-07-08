(ns conway.core)

(defn create-random-column
  [size]
  (into [] (repeatedly size #(rand-nth '(" " "#")))))

(defn create-random-grid
  [size]
  (into [] (repeatedly size #(create-random-column size))))

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

(defn generate-new-grid
  [grid]
  (map-indexed (fn [x-idx column]
                 (map-indexed (fn [y-idx cell]
                                (let [live-neighbors (count-live-neighbors grid x-idx y-idx)]
                                  (if (= "#" cell)
                                    (cond
                                      (< live-neighbors 2) " "
                                      (> live-neighbors 3) " "
                                      :else "#")
                                    (cond
                                      (= live-neighbors 3) "#"
                                      :else " ")))) column)) grid))

(defn -main
  "I don't do a lot... yet!"
  [& args]
  (print-grid (generate-new-grid (create-random-grid 5))))
