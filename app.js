document.addEventListener('DOMContentLoaded', () => {
    const arrayContainer = document.getElementById('arrayContainer');
    const arrayInput = document.getElementById('arrayInput');
    const submitArray = document.getElementById('submitArray');
    const generateArray = document.getElementById('generateArray');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const totalComparisonsElement = document.getElementById('totalComparisons');
    const totalSwapsElement = document.getElementById('totalSwaps');
    let array = [];
    let selectedAlgorithm = null;
    let isPaused = false;
    let animationSpeed = 500; // Increased delay for slower sorting
    let totalComparisons = 0;
    let totalSwaps = 0;
  
    const algorithms = {
      bubbleSort: bubbleSort,
      insertionSort: insertionSort,
      selectionSort: selectionSort,
      heapSort: heapSort,
      countingSort: countingSort,
      mergeSort: mergeSort,
      quickSort: quickSort,
      radixSort: radixSort,
      bucketSort: bucketSort
    };
  
    document.querySelectorAll('nav button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedAlgorithm = button.id;
      });
    });
  
    submitArray.addEventListener('click', () => {
      const input = arrayInput.value.split(',').map(item => isNaN(item) ? item.trim() : Number(item));
      if (input.every(item => typeof item === 'number' || typeof item === 'string')) {
        array = input;
        renderArray();
      } else {
        alert('Invalid input. Please enter a comma-separated list of numbers or characters.');
      }
    });
  
    generateArray.addEventListener('click', () => {
      array = Array.from({ length: 20 }, () => Math.random() < 0.5 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : Math.floor(Math.random() * 100) - 50);
      renderArray();
    });
  
    startButton.addEventListener('click', () => {
      if (selectedAlgorithm && array.length > 0) {
        startButton.disabled = true;
        totalComparisons = 0;
        totalSwaps = 0;
        algorithms[selectedAlgorithm](array);
      } else {
        alert('Please select an algorithm and input an array.');
      }
    });
  
    pauseButton.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    });
  
    resetButton.addEventListener('click', () => {
      array = [];
      arrayContainer.innerHTML = '';
      startButton.disabled = false;
      totalComparisonsElement.textContent = '0';
      totalSwapsElement.textContent = '0';
    });
  
    function renderArray() {
      arrayContainer.innerHTML = '';
      const maxValue = Math.max(...array.map(item => typeof item === 'number' ? Math.abs(item) : item.charCodeAt(0)));
      array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        const barHeight = typeof value === 'number' ? (value / maxValue) * 100 : (value.charCodeAt(0) / maxValue) * 100;
        bar.style.height = `${Math.abs(barHeight)}%`;
        bar.style.backgroundColor = typeof value === 'number' ? (value >= 0 ? `rgb(0, 0, ${255 - Math.abs(barHeight) * 2.55})` : `rgb(${255 - Math.abs(barHeight) * 2.55}, 0, 0)`) : '#888';
        bar.style.width = `${100 / array.length}%`;
        bar.textContent = value;
        bar.title = `Value: ${value}`;
        arrayContainer.appendChild(bar);
      });
    }
  
    function getValue(item) {
      return typeof item === 'number' ? item : item.charCodeAt(0);
    }
  
    async function bubbleSort(arr) {
      let n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (isPaused) await pause();
          highlightBars(j, j + 1);
          totalComparisons++;
          if (getValue(arr[j]) > getValue(arr[j + 1])) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            totalSwaps++;
            renderArray();
            await delay(animationSpeed);
          }
          unhighlightBars(j, j + 1);
        }
        markSorted(n - i - 1);
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function insertionSort(arr) {
      let n = arr.length;
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && getValue(arr[j]) > getValue(key)) {
          if (isPaused) await pause();
          arr[j + 1] = arr[j];
          totalComparisons++;
          totalSwaps++;
          renderArray();
          highlightBars(j, j + 1);
          await delay(animationSpeed);
          unhighlightBars(j, j + 1);
          j = j - 1;
        }
        arr[j + 1] = key;
        renderArray();
        markSorted(i);
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function selectionSort(arr) {
      let n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (isPaused) await pause();
          highlightBars(minIdx, j);
          totalComparisons++;
          if (getValue(arr[j]) < getValue(arr[minIdx])) {
            minIdx = j;
          }
          await delay(animationSpeed);
          unhighlightBars(minIdx, j);
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          totalSwaps++;
          renderArray();
          await delay(animationSpeed);
        }
        markSorted(i);
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function heapSort(arr) {
      let n = arr.length;
  
      async function heapify(n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
  
        totalComparisons++;
        if (left < n && getValue(arr[left]) > getValue(arr[largest])) {
          largest = left;
        }
  
        totalComparisons++;
        if (right < n && getValue(arr[right]) > getValue(arr[largest])) {
          largest = right;
        }
  
        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          totalSwaps++;
          renderArray();
          await delay(animationSpeed);
          await heapify(n, largest);
        }
      }
  
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
      }
  
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        totalSwaps++;
        renderArray();
        await delay(animationSpeed);
        await heapify(i, 0);
        markSorted(i);
      }
      markSorted(0);
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function countingSort(arr) {
      let n = arr.length;
      let max = Math.max(...arr.map(getValue));
      let min = Math.min(...arr.map(getValue));
      let range = max - min + 1;
      let count = Array(range).fill(0);
      let output = Array(n).fill(0);
  
      for (let i = 0; i < n; i++) {
        count[getValue(arr[i]) - min]++;
      }
  
      for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
      }
  
      for (let i = n - 1; i >= 0; i--) {
        output[count[getValue(arr[i]) - min] - 1] = arr[i];
        count[getValue(arr[i]) - min]--;
      }
  
      for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        renderArray();
        await delay(animationSpeed);
        markSorted(i);
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function mergeSort(arr) {
      async function merge(left, right) {
        let result = [];
        while (left.length && right.length) {
          if (isPaused) await pause();
          totalComparisons++;
          if (getValue(left[0]) < getValue(right[0])) {
            result.push(left.shift());
          } else {
            result.push(right.shift());
          }
          renderArray();
          await delay(animationSpeed);
        }
        return result.concat(left, right);
      }
  
      async function mergeSortRecursive(arr) {
        if (arr.length < 2) {
          return arr;
        }
        let middle = Math.floor(arr.length / 2);
        let left = await mergeSortRecursive(arr.slice(0, middle));
        let right = await mergeSortRecursive(arr.slice(middle));
        return await merge(left, right);
      }
  
      array = await mergeSortRecursive(arr);
      renderArray();
      for (let i = 0; i < array.length; i++) {
        markSorted(i);
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function quickSort(arr, left = 0, right = arr.length - 1) {
      async function partition(arr, left, right) {
        let pivot = getValue(arr[Math.floor((right + left) / 2)]);
        let i = left;
        let j = right;
        while (i <= j) {
          totalComparisons++;
          while (getValue(arr[i]) < pivot) {
            i++;
          }
          totalComparisons++;
          while (getValue(arr[j]) > pivot) {
            j--;
          }
          if (i <= j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            totalSwaps++;
            renderArray();
            await delay(animationSpeed);
            i++;
            j--;
          }
        }
        return i;
      }
  
      if (arr.length > 1) {
        let index = await partition(arr, left, right);
        if (left < index - 1) {
          await quickSort(arr, left, index - 1);
        }
        if (index < right) {
          await quickSort(arr, index, right);
        }
      }
      renderArray();
      for (let i = 0; i < arr.length; i++) {
        markSorted(i);
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function radixSort(arr) {
      let max = Math.max(...arr.map(getValue));
      let exp = 1;
      while (Math.floor(max / exp) > 0) {
        await countingSortByDigit(arr, exp);
        exp *= 10;
      }
      renderArray();
      for (let i = 0; i < arr.length; i++) {
        markSorted(i);
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    async function countingSortByDigit(arr, exp) {
      let n = arr.length;
      let output = Array(n).fill(0);
      let count = Array(10).fill(0);
  
      for (let i = 0; i < n; i++) {
        count[Math.floor(getValue(arr[i]) / exp) % 10]++;
      }
  
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }
  
      for (let i = n - 1; i >= 0; i--) {
        output[count[Math.floor(getValue(arr[i]) / exp) % 10] - 1] = arr[i];
        count[Math.floor(getValue(arr[i]) / exp) % 10]--;
      }
  
      for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        renderArray();
        await delay(animationSpeed);
      }
    }
  
    async function bucketSort(arr) {
      let n = arr.length;
      if (n <= 0) return;
  
      let min = Math.min(...arr.map(getValue));
      let max = Math.max(...arr.map(getValue));
      let bucketCount = Math.floor(Math.sqrt(n));
      let buckets = Array.from({ length: bucketCount }, () => []);
  
      for (let i = 0; i < n; i++) {
        let bucketIndex = Math.floor(((getValue(arr[i]) - min) / (max - min + 1)) * bucketCount);
        buckets[bucketIndex].push(arr[i]);
      }
  
      for (let i = 0; i < bucketCount; i++) {
        buckets[i].sort((a, b) => getValue(a) - getValue(b));
      }
  
      let index = 0;
      for (let i = 0; i < bucketCount; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
          arr[index++] = buckets[i][j];
          renderArray();
          await delay(animationSpeed);
          markSorted(index - 1);
        }
      }
      startButton.disabled = false;
      totalComparisonsElement.textContent = totalComparisons;
      totalSwapsElement.textContent = totalSwaps;
    }
  
    function highlightBars(index1, index2) {
      const bars = document.querySelectorAll('.bar');
      bars[index1].classList.add('comparing');
      bars[index2].classList.add('comparing');
    }
  
    function unhighlightBars(index1, index2) {
      const bars = document.querySelectorAll('.bar');
      bars[index1].classList.remove('comparing');
      bars[index2].classList.remove('comparing');
    }
  
    function markSorted(index) {
      const bars = document.querySelectorAll('.bar');
      bars[index].classList.add('sorted');
    }
  
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    function pause() {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (!isPaused) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }
  });